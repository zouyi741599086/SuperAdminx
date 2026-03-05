<?php
namespace app\utils;

use EasyWeChat\OfficialAccount\Application;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Component\Cache\Psr16Cache;
use support\Redis;
use support\Log;
/**
 * 微信公众号操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMpUtils
{
    public static function initApp()
    {
        $config = [
            'app_id'  => config('superadminx.wechat_gongzhonghao.AppID'),
            'secret'  => config('superadminx.wechat_gongzhonghao.AppSecret'),
            'token'   => 'easywechat_gzh',
            'aes_key' => '',

            /**
             * OAuth 配置
             * scopes：公众平台（snsapi_userinfo[需用户同意] / snsapi_base[静默授权]），开放平台：snsapi_login
             * redirect_url：OAuth授权完成后的回调页地址
             */
            'oauth'   => [
                'scopes'       => ['snsapi_base'],
                'redirect_url' => '', // 这里可以留空，后面动态设置
            ],

            /**
             * 接口请求相关配置，超时时间等，具体可用参数请参考：
             * https://github.com/symfony/symfony/blob/5.3/src/Symfony/Contracts/HttpClient/HttpClientInterface.php
             */
            'http'    => [
                'throw'   => true, // 状态码非 200、300 时是否抛出异常，默认为开启
                'timeout' => 5.0,
                // 'base_uri' => 'https://api.weixin.qq.com/', // 如果你在国外想要覆盖默认的 url 的时候才使用，根据不同的模块配置不同的 uri
                'retry'   => true, // 使用默认重试配置
            ],
        ];
        return new Application($config);
        // 缓存使用的redis
        //return (new Application($config))->setCache(new Psr16Cache(new RedisAdapter(Redis::connection()->client())));
    }

    /**
     * 获取公众号的token
     * @return string 返回的accessToken
     */
    public static function getToken() : string
    {
        $accessToken = self::initApp()->getAccessToken();
        return $accessToken->getToken();
    }

    /**
     * 获取微信API服务器IP
     * @return array 返回的IP数组
     */
    public static function getApiDomainIp() : array
    {
        try {
            $response = self::initApp()->getClient()->postJson('/cgi-bin/get_api_domain_ip');
            if ($response->isFailed()) {
                throw new \Exception('获取微信API服务器IP错误');
            }
            $response = $response->toArray();

            if (isset($response['ip_list'])) {
                return $response['ip_list'];
            } else {
                throw new \Exception($response['errmsg'] ?? '获取微信API服务器IP错误');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取网页授权URL（生成重定向到微信的URL）
     * 
     * @param string $redirectUrl   授权后重定向的回调地址
     * @return string               授权URL
     */
    public static function getOauthRedirectUrl(string $redirectUrl) : string
    {
        try {
            $response = self::initApp()->getOAuth()
                //->scopes([$scope])  // 设置授权类型 这里直接调取上面$config['oauth']['scopes']
                ->redirect($redirectUrl);
            return $response;
        } catch (\Exception $e) {
            Log::error('生成微信授权URL失败: ' . $e->getMessage());
            abort('生成微信授权URL失败');
        }
    }

    /**
     * 通过code获取用户授权信息
     * 
     * @param string $code 授权码
     * @return array 用户授权信息
     */
    public static function getUserByCode(string $code) : array
    {
        try {
            // 获取 OAuth 授权用户信息
            $user = self::initApp()->getOAuth()->userFromCode($code);

            // $user->getId(); 对应微信的 openid
            // $user->getNickname(); 对应微信的 nickname
            // $user 里没有openid， $user->id 便是 openid. 如果你想拿微信返回给你的原样的全部信息，请使用：$user->getRaw();
            $response = $user->getRaw();

            return $response;
        } catch (\Exception $e) {
            Log::error('通过code获取微信用户信息失败: ' . $e->getMessage());
            abort('获取微信用户信息失败');
        }
    }

    /**
     * 获取JS-SDK配置参数
     * 
     * @param string $url           当前网页的URL（不包含#及其后面部分）
     * @param array $jsApiList      需要使用的JS接口列表
     * @param array $openTagList    开放标签列表
     * @param bool $debug           是否开启调试模式
     * @return array                JS-SDK配置参数
     */
    public static function getJsSdkConfig(string $url, array $jsApiList = [], array $openTagList = [], bool $debug = false) : array
    {
        try {
            // 获取jssdk实例
            $utils = self::initApp()->getUtils();

            // 构建配置
            $config = $utils->buildJsSdkConfig($url, $jsApiList, $openTagList, $debug);

            // 返回配置数组
            return $config;
        } catch (\Exception $e) {
            Log::error('生成JS-SDK配置失败: ' . $e->getMessage());
            abort('生成JS-SDK配置失败');
        }
    }

    /**
     * 发送订阅通知（订阅消息）
     * 
     * @param string $openid            接收者的openid
     * @param string $templateId        订阅消息模板ID
     * @param array $data               模板内容
     * @param ?string $page              跳转的页面路径（可选）可以为http链接 可以为小程序路径
     * @param ?string $miniprogram       跳转的小程序appid（可选）
     * @param ?string $miniprogramState  跳转的小程序版本（可选）developer为开发版；trial为体验版；formal为正式版；默认为正式版
     * @return array 发送结果
     */
    public static function sendSubscribeMessage(
        string $openid,
        string $templateId,
        array $data,
        ?string $page = null,
        ?string $miniprogram = null,
        ?string $miniprogramState = null,
    ) : array {
        try {
            // 准备请求数据
            $requestData = [
                'touser'      => $openid,
                'template_id' => $templateId,
                'data'        => $data,
            ];

            // 添加跳转页面（可选）
            if (! empty($page)) {
                $requestData['page'] = $page;
            }

            // 跳转小程序（可选）必须是一个主体下的才能跳转成功
            if ($miniprogram) {
                $requestData['miniprogram'] = [
                    'appid'    => $miniprogram,
                    'pagepath' => $page ?: 'pages/index/index',
                ];
                // 小程序版本
                if ($miniprogramState) {
                    $requestData['miniprogram_state'] = $miniprogramState;
                }
            }

            $response = self::initApp()->getClient()->postJson('/cgi-bin/message/subscribe/bizsend', $requestData);

            if ($response->isFailed()) {
                throw new \Exception('请求微信API失败');
            }

            $result = $response->toArray();

            // 检查返回结果
            if (isset($result['errcode']) && $result['errcode'] != 0) {
                $errorMsg = $result['errmsg'] ?? '发送订阅通知失败';
                Log::error('微信订阅通知返回错误: ' . $errorMsg . ', 错误码: ' . $result['errcode']);
                throw new \Exception($errorMsg, $result['errcode']);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('订阅通知发送失败: ' . $e->getMessage());
            abort($e->getMessage());
        }
    }

}