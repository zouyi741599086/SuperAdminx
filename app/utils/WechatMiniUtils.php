<?php
namespace app\utils;

use EasyWeChat\MiniApp\Application;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Component\Cache\Psr16Cache;
use support\Redis;
use support\Log;

/**
 * 微信小程序操作
 * 
 * WechatMiniUtils::getToken() 获取小程序操作的token
 * WechatMiniUtils::getWxAcodeunLimit(string $page, string $scene = '', string $path = null, int $width = 280) 生成小程序二维码
 * WechatMiniUtils::getOpenid(string $code = '') 获取小程序openid
 * WechatMiniUtils::getPhoneNumber(string $code = '') 获取用户的手机号
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMiniUtils
{
    public static function initApp()
    {
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

        return (new Application($config))
            // 缓存使用的redis
            ->setCache(new Psr16Cache(new RedisAdapter(Redis::connection()->client())));
    }

    /**
     * 获取小程序的token
     */
    public static function getToken() : string
    {
        $accessToken = self::initApp()->getAccessToken();
        return $accessToken->getToken();
    }

    /**
     * 生成小程序码
     * @param string $page 小程序的url地址 pages/index/index
     * @param string $scene 参数，最大32个字符串，类似于： a=1&b=2
     * @param string $path 二维码保存的路劲 ./public/qrocde/111.png
     * @param int $width 二维码的宽度，最小280，最大1280
     * @return string 图片的路劲
     */
    public static function getWxAcodeunLimit(string $page, string $scene = '', string $path = '', int $width = 280) : string
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

    /**
     * 订单表发货
     * @param string $openid 用户的openid
     * @param string $goods_title 商品名称
     * @param string $transaction_id 微信支付的单号
     * @param int  $logistics_type 发货方式枚举值：1、实体物流配送采用快递公司进行实体物流配送形式 2、同城配送 3、虚拟商品，虚拟商品，例如话费充值，点卡等，无实体配送形式 4、用户自提
     * @param string $tracking_no 快递单号
     * @param string $express_company 快递公司编码 sa_express表去拿wechat_express_code字段
     * @param string $receiver_contact 收件人手机号，顺丰必须带
     */
    public static function updateShippingInfo(
        string $openid,
        string $goods_title,
        string $transaction_id,
        int $logistics_type = 3,
        string $tracking_no = '',
        string $express_company = '',
        string $receiver_contact = '',
    ) {
        $params   = [
            'order_key'      => [
                'order_number_type' => 2, // 使用微信支付单号
                'transaction_id'    => $transaction_id,
            ],
            'logistics_type' => $logistics_type,
            'delivery_mode'  => 'UNIFIED_DELIVERY',
            'shipping_list'  => [
                [
                    'tracking_no'     => $tracking_no, // 快递单号
                    'express_company' => $express_company, // 快递公司编码
                    'item_desc'       => $goods_title, // 购买的商品名称
                    'contact'         => [
                        'receiver_contact' => $receiver_contact, // 收件人手机号，发顺丰必填
                    ]
                ]
            ],
            'upload_time'    => (new \DateTime)->format(\DateTime::RFC3339),
            'payer'          => [
                'openid' => $openid, // 用户的openid
            ]
        ];
        $api      = self::initApp()->getClient();
        $response = $api->postJson('/wxa/sec/order/upload_shipping_info', $params);
        $response = $response->toArray();
        if ($response['errcode'] != 0) {
            Log::error("微信订单发货：" . $response['errmsg'] ?? '订单发货失败~', $params);
        }
    }

    /**
     * 查询订单发货状态
     */
    public static function getOrderState($transaction_id)
    {
        $api      = self::initApp()->getClient();
        $response = $api->postJson('/wxa/sec/order/get_order', [
            'transaction_id' => $transaction_id
        ]);
        $response = $response->toArray();
        if ($response['errcode'] != 0) {
            abort($response['errmsg'] ?? '获取订单发货状态失败~');
        }
        return $response['order']['order_state'];
    }

    /**
     * 获取物流公司列表
     */
    public static function getDeliveryList()
    {
        $api      = self::initApp()->getClient();
        $response = $api->postJson('/cgi-bin/express/delivery/open_msg/get_delivery_list');
        if ($response->isFailed()) {
            abort('获取快递公司错误错误');
        }

        $response = $response->toArray();

        // 返回字符串，打印看的
// 		$str = '';
// 		foreach ($response['delivery_list'] as $k => $v) {
// 			$str .= "{$v['delivery_id']}---{$v['delivery_name']}<br/>";
// 		}

        return $response;
    }
}