<?php
namespace app\utils;

use EasyWeChat\MiniApp\Application;

/**
 * 微信小程序操作
 * 
 * WechatMini::getToken() 获取小程序操作的token
 * WechatMini::getWxAcodeunLimit(string $page, string $scene = '', string $path = null, int $width = 280) 生成小程序二维码
 * WechatMini::getOpenid(string $code = '') 获取小程序openid
 * WechatMini::getPhoneNumber(string $code = '') 获取用户的手机号
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMini
{
    private static $app;
    public static function initApp()
    {
        if (self::$app) {
            return self::$app;
        }
        $config = [
            'app_id'  => config('superadminx.wechat_xiaochengxu.AppID'),
            'secret'  => config('superadminx.wechat_xiaochengxu.AppSecret'),
            'token'   => 'easywechat',
            'aes_key' => '',

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
        return self::$app = new Application($config);
    }

    /**
     * 获取小程序的token
     */
    public static function getToken() : string
    {
        $accessToken = self::initApp()->getAccessToken();
        return $accessToken->getToken(); // string
    }

    /**
     * 生成小程序码
     * @param string $page 小程序的url地址 pages/index/index
     * @param string $scene 参数，最大32个字符串，类似于： a=1&b=2
     * @param string $path 二维码保存的路劲 ./public/qrocde/111.png
     * @param int $width 二维码的宽度，最小280，最大1280
     * @return string 图片的路劲
     */
    public static function getWxAcodeunLimit(string $page, string $scene = '', string $path, int $width = 280) : string
    {
        try {
            $response = self::initApp()->getClient()->postJson('/wxa/getwxacodeunlimit', [
                'scene'      => $scene,
                'page'       => $page,
                'width'      => $width,
                'check_path' => false,
            ]);

            if ($response->isFailed()) {
                throw new \Exception('获取小程序二维码错误');
            }
            // 如果没得path就直接把图片链接返回
            if (! $path) {
                return $response->toDataUrl();
            }
            // 如果有path就存为图片
            $response->saveAs($path);
            return $path;
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 用code换取openid
     * @param string $code 微信小程序login的code
     * @return [
     * 	'openid' => 'xxxxxx',
     *  'session_key' => 'xxxxxxx'
     * ]
     */
    public static function getOpenid(string $code) : array
    {
        try {
            $response = self::initApp()->getClient()->get('/sns/jscode2session', [
                'appid'      => config('superadminx.wechat_xiaochengxu.AppID'),
                'secret'     => config('superadminx.wechat_xiaochengxu.AppSecret'),
                'js_code'    => $code,
                'grant_type' => 'authorization_code',
            ]);
            $result   = $response->toArray();
            if (! isset($result['openid']) || ! $result['openid']) {
                throw new \Exception($response['errmsg'] ?? '获取用户openid错误');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
        return $result;
    }

    /**
     * 小程序获取手机号
     * @param string $code 用button》open-type="getPhoneNumber"》获取code换取手机号
     * @return string 手机号
     */
    public static function getPhoneNumber(string $code) : string
    {
        try {
            $response = self::initApp()->getClient()->postJson('wxa/business/getuserphonenumber', [
                'code' => $code
            ]);
            $response = $response->toArray();
            if ($response['errcode'] == 0 && $response['errmsg'] == 'ok') {
                return $response['phone_info']['phoneNumber'];
            } else {
                throw new \Exception($response['errmsg'] ?? '小程序获取手机号错误');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }
}