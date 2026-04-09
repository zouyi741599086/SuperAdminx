<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;
use plugin\shop\app\common\model\ShopOrderModel;
use plugin\shop\app\common\model\ShopOrderAfterSalesModel;
use plugin\balance\app\common\model\BalanceWithdrawModel;
use plugin\integralShop\app\common\model\IntegralOrderModel;

/**
 * 统计
 *
 * @author zy <741599086@qq.com>
 * */
class AdminTotal
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
    ) {}

    /**
     * 后台首页统计
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function index(Request $request) : Response
    {
        // 待发货的订单
        $data['shop_order_fahuo'] = ShopOrderModel::where('status', 20)
            ->count();

        // 待处理售后的订单
        $data['shop_order_after_sales'] = ShopOrderAfterSalesModel::where('status', 'in', [10, 40, 50, 70])
            ->count();

        // 待审核提现
        $data['balance_withdraw'] = BalanceWithdrawModel::where('status', 2)
            ->count();

        // 待发货积分订单
        $data['integral_order'] = IntegralOrderModel::where('status', 10)
            ->count();

        return success($data, '获取成功');
    }


}
