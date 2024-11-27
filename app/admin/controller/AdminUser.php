<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\AdminUserLogic;

/**
 * 管理用户
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUser
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * 获取列表
     * @method get
     * @auth adminUserGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = AdminUserLogic::getList($request->get());
        return success($list);
    }

    /**
     * @log 添加管理员
     * @method post
     * @auth adminUserCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request): Response
    {
        AdminUserLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改管理员
     * @method post
     * @auth adminUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        AdminUserLogic::udpate($request->post());
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
        $data = AdminUserLogic::findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 删除管理员
     * @method post
     * @auth adminUserDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request): Response
    {
        AdminUserLogic::delete($request->post('id'), $request->adminUser['id']);
        return success([], '删除成功');
    }

    /**
     * @log 管理员锁定状态修改
     * @method post
     * @auth adminUserUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request): Response
    {
        AdminUserLogic::updateStatus($request->post());
        return success([], '操作成功');
    }

    /**
     * @log 修改自己的登录密码
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updatePassword(Request $request): Response
    {
        AdminUserLogic::updatePassword($request->post(), $request->adminUser['id']);
        return success([], '修改成功，请重新登录');
    }

    /**
     * 获取自己的资料
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getAdminUser(Request $request): Response
    {
        $data = AdminUserLogic::getAdminUser($request->adminUser['id']);
        return success($data);
    }

    /**
     * @log 修改自己的资料
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateInfo(Request $request): Response
    {
        AdminUserLogic::updateInfo($request->post(), $request->adminUser['id']);
        return success([], '修改成功');
    }
}
