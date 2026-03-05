<?php
namespace plugin\balance\app\admin\controller;

use support\Request;
use support\Response;
use plugin\balance\app\common\service\BalanceService;

/**
 * 用户余额 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Balance
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private BalanceService $balanceService,
    ) {}

    /**
     * 列表
     * @method get
     * @auth balanceGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $with = ['User' => function ($query)
        {
            $query->field('id,img,name,tel');
        }];
        $list = $this->balanceService->getList($request->get(), $with);
        return success($list);
    }

    /**
     * 获取余额类型的配置
     * @method get
     * @auth balanceGetList
     * @param Request $request 
     * @return Response
     */
    public function getBalanceType(Request $request)
    {
        return success(config('plugin.balance.superadminx.balance_type'));
    }

    /**
     * 获取余额的明细类型的配置
     * @method get
     * @param Request $request 
     * @param string $balance_type
     * @return Response
     */
    public function getDetailsType(Request $request, string $balance_type)
    {
        $balanceType = config('plugin.balance.superadminx.balance_type', 'array');
        $result      = [];
        foreach ($balanceType as $value) {
            if ($value['field'] == $balance_type) {
                $result = $value['details_type'];
            }
        }
        return success($result);
    }

    /**
     * @log 变更用户余额
     * @method post
     * @auth updateBalance
     * @param Request $request 
     * @return Response
     */
    public function updateBalance(Request $request) : Response
    {
        $this->balanceService->updateBalance($request->post());
        return success([], '操作成功');
    }

    /**
     * @log 用户余额账户转账
     * @method post
     * @auth balanceTurn
     * @param Request $request 
     * @return Response
     */
    public function turn(Request $request) : Response
    {
        $this->balanceService->turn($request->post());
        return success([], '操作成功');
    }

    /**
     * @log 导出用户余额数据
     * @method get
     * @auth balanceExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $result = $this->balanceService->exportData($request->get());
        return success($result);
    }

    /**
     * 统计余额
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTotal(Request $request) : Response
    {
        $result = $this->balanceService->getTotal();
        return success($result);
    }

}