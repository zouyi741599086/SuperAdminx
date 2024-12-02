<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\AdminRoleLogic;

/**
 * 后台用户角色
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRole
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * 获取列表
     * @method get
     * @auth adminRoleGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = AdminRoleLogic::getList($request->get());
        return success($list);
    }

    /**
     * @log 添加管理员角色
     * @method post
     * @auth adminRoleCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request): Response
    {
        AdminRoleLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改管理员角色
     * @method post
     * @auth adminRoleUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        AdminRoleLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function findData(Request $request): Response
    {
        $data = AdminRoleLogic::findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 删除管理员角色
     * @method post
     * @auth adminRoleDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request): Response
    {
        AdminRoleLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * 获取某个角色的连接权限
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getDataMenu(Request $request): Response
    {
        $data = AdminRoleLogic::getDataMenu($request->get('id'));
        return success($data);
    }

    /**
     * @log 修改角色的权限
     * @method post
     * @auth adminRoleAuth
     * @param Request $request 
     * @return Response
     */
    public function updateDataMenu(Request $request): Response
    {
        AdminRoleLogic::updateDataMenu($request->post());
        return success([], '修改成功');
    }
}
