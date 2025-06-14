<?php
namespace app\admin\controller;

use support\Request;
use support\Response;

use app\common\logic\AdminUserShortcutMenuLogic;

/**
 * 用户快捷菜单 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserShortcutMenu
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    
    // 不需要登录的方法
    protected $noNeedLogin = [];


    /**
     * 获取我的快捷菜单列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $params['admin_user_id'] = $request->adminUser->id;
        $list = AdminUserShortcutMenuLogic::getList($params);
        return success($list);
    }

    /**
     * 获取我的所有的菜单列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getMenuList(Request $request): Response
    {
        $list = AdminUserShortcutMenuLogic::getMenuList($request->adminUser->id);
        return success($list);
    }

    /**
     * 修改用户快捷菜单
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        AdminUserShortcutMenuLogic::update($request->adminUser->id,$request->post());
        return success([], '修改成功');
    }

}