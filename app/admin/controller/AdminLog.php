<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\AdminLogLogic;
/**
 * 操作日志
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLog
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * 获取列表
     * @method get
     * @auth adminLog
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = AdminLogLogic::getList($request->get());
        return success($list);
    }

}
