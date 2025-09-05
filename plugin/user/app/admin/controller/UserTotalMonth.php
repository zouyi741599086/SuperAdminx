<?php
namespace plugin\user\app\admin\controller;

use support\Request;
use support\Response;
use plugin\user\app\common\logic\UserTotalMonthLogic;

/**
 * 用户月统计 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalMonth
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];


    /**
     * 列表
     * @method get
     * @auth userTotalMonthGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = UserTotalMonthLogic::getList($request->get());
        return success($list);
    }

    /**
     * 统计
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTotal(Request $request) : Response
    {
        $data = UserTotalMonthLogic::getTotal();
        return success($data);
    }

    /**
     * @log 导出用户月统计数据
     * @method get
     * @auth userTotalMonthExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $data = UserTotalMonthLogic::exportData($request->get());
        return success($data);
    }

}