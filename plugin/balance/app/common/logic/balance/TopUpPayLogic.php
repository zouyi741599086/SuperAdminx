<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\user\app\common\model\UserInfoModel;
use app\utils\PayUtils;

/**
 * 充值支付
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class TopUpPayLogic
{

    /**
     * 支付
     * @param int $userId 用户ID
     * @param float $money 充值金额
     * @param string $payType   支付方式 alipay》支付宝、wechat》微信
     * @param string $paySource 支付源 web》网页支付，mp》公众号支付，h5》H5支付，app》APP支付，mini》小程序支付
     */
    public function pay(int $userId, float $money, string $payType, string $paySource)
    {
        $money = d2($money);
        if ($money <= 0) {
            abort('充值金额错误');
        }

        $result = match ($payType) {
            'wechat' => $this->wechatPay($userId, $money, $payType, $paySource),
            'alipay' => $this->aliPay($userId, $money, $payType, $paySource),
            default  => abort('支付方式错误'),
        };
        return $result;
    }

    /**
     * 余额支付
     * @param int $userId 用户ID
     * @param float $money 充值金额
     * @param string $payType 支付类型
     * @param string $paySource 支付来源
     */
    private function wechatPay(int $userId, float $money, string $payType, string $paySource)
    {
        $payUtils = new PayUtils('/app/balance/api/BalanceTopUp/wechatNotify');
        $params   = [
            'out_trade_no' => get_order_no('C'),
            'description'  => '余额充值',
            'attach'       => http_build_query([
                'money'      => $money,
                'user_id'    => $userId,
                'pay_type'   => $payType,
                'pay_source' => $paySource,
            ]),
            'amount'       => [
                'total'    => intval(bcmul($money, 100)),
                'currency' => 'CNY',
            ],
        ];

        // 如果是小程序支付
        if ($paySource == 'mini') {
            $params['payer']['openid'] = UserInfoModel::where('user_id', $userId)->value('weixin_mini_openid');
        }

        return $payUtils->wechatPay($params, $paySource);
    }

    /**
     * 支付宝支付
     * @param int $userId 用户ID
     * @param int $userId 用户ID
     * @param float $money 充值金额
     * @param string $payType 支付类型
     * @param string $paySource 支付来源
     */
    private function alipay(int $userId, float $money, string $payType, string $paySource)
    {
        $payUtils = new PayUtils('/app/balance/api/BalanceTopUp/aliNotify');
        $params   = [
            'out_trade_no'    => get_order_no('C'),
            'subject'         => '余额充值',
            'passback_params' => urlencode(http_build_query([
                'money'      => $money,
                'user_id'    => $userId,
                'pay_type'   => $payType,
                'pay_source' => $paySource,
            ])),
            'total_amount'    => $money,
        ];

        return $payUtils->alipay($params, $paySource);
    }
}