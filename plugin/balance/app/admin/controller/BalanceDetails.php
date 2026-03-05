<?php
namespace plugin\balance\app\admin\controller;

use support\Request;
use support\Response;
use plugin\balance\app\common\service\BalanceDetailsService;

/**
 * 用户余额明细 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceDetails
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private BalanceDetailsService $balanceDetailsService,
    ) {}

    /**
     * 列表
     * @method get
     * @auth balanceDetailsGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $with = ['User' => function ($query)
        {
            $query->field('id,img,name,tel');
        }];
        $list = $this->balanceDetailsService->getList($request->get(), $with);
        return success($list);
    }

    /**
     * @log 导出用户余额明细数据
     * @method get
     * @auth balanceDetailsExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $data = $this->balanceDetailsService->exportData($request->get());
        return success($data);
    }
}