<?php
namespace app\utils;

use Yansongda\Pay\Pay;

/**
 * 支付
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class Pays
{

    public static $config;

    /**
     * 注入配置
     * @param string $notify_url 回调地址 如/api/Pay/notify
     */
    public static function setConfig(string $notify_url = null)
    {
        self::$config = [
            'alipay' => [
                'default' => [
                    // 必填-支付宝分配的 app_id
                    'app_id'                  => '',
                    // 必填-应用私钥 字符串或路径
                    // 在 https://open.alipay.com/develop/manage 《应用详情->开发设置->接口加签方式》中设置
                    'app_secret_cert'         => '',
                    // 必填-应用公钥证书 路径
                    // 设置应用私钥后，即可下载得到以下3个证书
                    'app_public_cert_path'    => '',
                    // 必填-支付宝公钥证书 路径
                    'alipay_public_cert_path' => '',
                    // 必填-支付宝根证书 路径
                    'alipay_root_cert_path'   => '',
                    'return_url'              => '',
                    'notify_url'              => '',
                    // 选填-第三方应用授权token
                    'app_auth_token'          => '',
                    // 选填-服务商模式下的服务商 id，当 mode 为 Pay::MODE_SERVICE 时使用该参数
                    'service_provider_id'     => '',
                    // 选填-默认为正常模式。可选为： MODE_NORMAL, MODE_SANDBOX, MODE_SERVICE
                    'mode'                    => Pay::MODE_NORMAL,
                ]
            ],
            'wechat' => [
                'default' => [
                    // 必填-商户号，服务商模式下为服务商商户号
                    // 可在 https://pay.weixin.qq.com/ 账户中心->商户信息 查看
                    'mch_id'                  => config('superadminx.wechat_pay.mch_id'),
                    // 选填-v2商户私钥
                    'mch_secret_key_v2'       => config('superadminx.wechat_pay.mch_secret_key_v2'),
                    // 必填-v3 商户秘钥
                    // 即 API v3 密钥(32字节，形如md5值)，可在 账户中心->API安全 中设置
                    'mch_secret_key'          => config('superadminx.wechat_pay.mch_secret_key'),
                    // 必填-商户私钥 字符串或路径
                    // 即 API证书 PRIVATE KEY，可在 账户中心->API安全->申请API证书 里获得
                    // 文件名形如：apiclient_key.pem
                    'mch_secret_cert'         => config('superadminx.wechat_pay.mch_secret_cert'),
                    // 必填-商户公钥证书路径
                    // 即 API证书 CERTIFICATE，可在 账户中心->API安全->申请API证书 里获得
                    // 文件名形如：apiclient_cert.pem
                    'mch_public_cert_path'    => config('superadminx.wechat_pay.mch_public_cert_path'),
                    // 必填-微信回调url
                    // 不能有参数，如?号，空格等，否则会无法正确回调
                    'notify_url'              => config('superadminx.url') . $notify_url,
                    // 选填-公众号 的 app_id
                    // 可在 mp.weixin.qq.com 设置与开发->基本配置->开发者ID(AppID) 查看
                    'mp_app_id'               => '',
                    // 选填-小程序 的 app_id
                    'mini_app_id'             => config('superadminx.wechat_xiaochengxu.AppID'),
                    // 选填-app 的 app_id
                    'app_id'                  => '',
                    // 选填-合单 app_id
                    'combine_app_id'          => '',
                    // 选填-合单商户号 
                    'combine_mch_id'          => '',
                    // 选填-服务商模式下，子公众号 的 app_id
                    'sub_mp_app_id'           => '',
                    // 选填-服务商模式下，子 app 的 app_id
                    'sub_app_id'              => '',
                    // 选填-服务商模式下，子小程序 的 app_id
                    'sub_mini_app_id'         => '',
                    // 选填-服务商模式下，子商户id
                    'sub_mch_id'              => '',
                    // 选填-微信平台公钥证书路径, optional，强烈建议 php-fpm 模式下配置此参数
                    'wechat_public_cert_path' => [
                        //'45F59D4DABF31918AFCEC556D5D2C6E376675D57' => __DIR__.'/Cert/wechatPublicKey.crt',
                    ],
                    // 选填-默认为正常模式。可选为： MODE_NORMAL, MODE_SERVICE
                    'mode'                    => Pay::MODE_NORMAL,
                ]
            ],
            'unipay' => [
                'default' => [
                    // 必填-商户号
                    'mch_id'                  => '',
                    // 必填-商户公私钥
                    'mch_cert_path'           => '',
                    // 必填-商户公私钥密码
                    'mch_cert_password'       => '',
                    // 必填-银联公钥证书路径
                    'unipay_public_cert_path' => '',
                    // 必填
                    'return_url'              => '',
                    // 必填
                    'notify_url'              => '',
                ],
            ],
            'logger' => [
                'enable'   => false,
                'file'     => './runtime/pay/pay.log',
                'level'    => 'info', // 建议生产环境等级调整为 info，开发环境为 debug
                'type'     => 'single', // optional, 可选 daily.
                'max_file' => 30, // optional, 当 type 为 daily 时有效，默认 30 天
            ],
            'http'   => [ // optional
                'timeout'         => 5.0,
                'connect_timeout' => 5.0,
                // 更多配置项请参考 [Guzzle](https://guzzle-cn.readthedocs.io/zh_CN/latest/request-options.html)
            ],
        ];
        Pay::config(self::$config);
    }

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    /**
     * 发起微信小程序支付
     * @param array $data
     * $data = [
     *       'out_trade_no' => 'E20241212021244esdfw',
     *       'description'  => '商城订单支付',
     *       'attach'       => a=1&b=2,
     *       'amount'       => [
     *           'total'    => 1,
     *           'currency' => 'CNY',
     *       ],
     *       'payer'        => [
     *           'openid' => 'dsfs454f5s54ew54f5s',
     *      ],
     *   ];
     * @param string $notify_url 微信支付回调地址
     * @return \Yansongda\Artful\Rocket|\Yansongda\Supports\Collection
     */
    public static function wechatMiniPay(array $data, string $notify_url)
    {
        // 先注入配置
        self::setConfig($notify_url);
        // 发起支付
        return Pay::wechat()->mini($data);
    }


    /**
     * 微信支付回调解密数据
     * @return array 支付回调解密的参数
     */
    public static function wechatNotify() : array
    {
        // 先注入配置
        self::setConfig();

        try {
            $result = Pay::wechat()->callback(request()->post());
            $result = $result->resource['ciphertext'] ?? [];

            if (
                isset($result['trade_state']) &&
                $result['trade_state'] == 'SUCCESS' &&
                isset($result['appid']) &&
                $result['appid'] == config('superadminx.wechat_xiaochengxu.AppID') &&
                isset($result['mchid']) &&
                $result['mchid'] == config('superadminx.wechat_pay.mch_id')
            ) {
                return $result;
            } else {
                throw new \Exception('回调解密失败');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 微信支付回调成功
     */
    public static function wechatNotifySuccess()
    {
        // 先注入配置
        self::setConfig();

        return Pay::wechat()->success();
    }

    /**
     * 微信退款
     * @param string $transaction_id 微信支付单号
     * @param float 退款金额，单位：元
     * @param float 原支付订单交易的订单总金额，单位：元
     */
    public static function wechatRefund(string $transaction_id, float $refund, float $total)
    {
        // 先注入配置
        self::setConfig();
        try {
            $order = [
                'transaction_id' => $transaction_id,
                'out_refund_no'  => get_order_no(),
                'amount'         => [
                    'refund'   => intval($refund * 100), // 退款金额
                    'total'    => intval($total * 100), // 原支付交易的订单总金额，单位为分
                    'currency' => 'CNY',
                ],
            ];

            $result = Pay::wechat()->refund($order);
            if ($result->status == 'CLOSED') {
                throw new \Exception('退款已关闭');
            }
            if ($result->status == 'ABNORMAL') {
                throw new \Exception('退款异常');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

}