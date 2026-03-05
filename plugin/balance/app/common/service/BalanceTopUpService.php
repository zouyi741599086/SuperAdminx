<?php
namespace plugin\balance\app\common\service;

use plugin\balance\app\common\logic\balance\{TopUpPayNotifyLogic, TopUpPayLogic};

/**
 * 充值支付
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceTopUpService
{

    public function __construct(
        private TopUpPayLogic $topUpPayLogic,
        private TopUpPayNotifyLogic $topUpPayNotifyLogic,
    ) {}

    /**
     * 支付
     * @param int $userId 用户ID
     * @param float $money 充值金额
     * @param string $payType   支付方式 alipay》支付宝、wechat》微信
     * @param string $paySource 支付源 web》网页支付，mp》公众号支付，h5》H5支付，app》APP支付，mini》小程序支付
     */
    public function pay(int $userId, float $money, string $payType, string $paySource)
    {
        return $this->topUpPayLogic->pay($userId, $money, $payType, $paySource);
    }

    /**
     * 微信支付回调
     * */
    public function wechatNotify()
    {
        return $this->topUpPayNotifyLogic->wechatNotify();
    }

    /**
     * 支付宝支付回调
     * */
    public function aliNotify()
    {
        return $this->topUpPayNotifyLogic->aliNotify();
    }

}