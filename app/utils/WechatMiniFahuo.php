<?php
namespace app\utils;

use EasyWeChat\MiniApp\Application;
use support\Log;

/**
 * 微信小程序 订单发货
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMiniFahuo
{

    public static $config;
    public static $app;

    public static function getApp()
    {
        if (self::$app) {
            return self::$app;
        }
        self::$config = [
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

        return self::$app = new Application(self::$config);
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
        $api      = self::getApp()->getClient();
        $response = $api->postJson('/wxa/sec/order/upload_shipping_info', [
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
        ]);
        $response = $response->toArray();
        if ($response['errcode'] != 0) {
            Log::error("微信订单发货：" . $response['errmsg'] ?? '订单发货失败~', $response);
        }
    }

    /**
     * 查询订单发货状态
     */
    public static function getOrderState($transaction_id)
    {
        $api      = self::getApp()->getClient();
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
        $api      = self::getApp()->getClient();
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