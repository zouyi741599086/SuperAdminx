<?php
namespace plugin\balance\app\api\controller;

use support\Request;
use support\Response;
use plugin\balance\app\common\service\BalanceTopUpService;

/**
 * 充值支付
 *
 * @author zy <741599086@qq.com>
 * */
class BalanceTopUp
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = ['wechatNotify', 'aliNotify'];
    // 不需要加密的方法
    protected $noNeedEncrypt = ['wechatNotify', 'aliNotify'];

    public function __construct(
        private BalanceTopUpService $balanceTopUpService,
    ) {}

    /**
     * 充值支付
     * @method post
     * @param Request $request 
     * @param string $money 需要充值的金额
     * @param string $pay_type 支付方式：alipay》支付宝、wechat》微信
     * @param string $pay_source 支付方式，并没有使用所有：mp》公众号支付，h5》H5支付，app》APP支付，mini》小程序支付
     */
    public function pay(Request $request, string $money, string $pay_type, string $pay_source)
    {
        $result = $this->balanceTopUpService->pay($request->user->id, $money, $pay_type, $pay_source);
        return success($result);
    }

    /**
     * 微信支付回调成功后调用
     * @param Request $request
     */
    public function wechatNotify(Request $request)
    {
        return $this->balanceTopUpService->wechatNotify();
    }

    /**
     * 支付宝支付回调
     * @param Request $request
     */
    public function aliNotify(Request $request)
    {
        $this->balanceTopUpService->aliNotify();
        return new Response(200, [], 'success');
    }

}