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
        // 待审核提现
        $data['balance_withdraw'] = BalanceWithdrawModel::where('status', 2)
            ->count();

        return success($data, '获取成功');
    }


}
