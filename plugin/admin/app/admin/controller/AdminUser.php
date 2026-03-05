<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\service\AdminUserService;

/**
 * 管理用户
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUser
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private AdminUserService $adminUserService,
    ) {}

    /**
     * 获取列表
     * @method get
     * @auth adminUserGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->adminUserService->getList($request->get());
        return success($list);
    }

    /**
     * @log 添加管理员
     * @method post
     * @auth adminUserCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->adminUserService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改管理员
     * @method post
     * @auth adminUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->adminUserService->udpate($request->post());
        return success([], '修改成功');
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function findData(Request $request) : Response
    {
        $data = $this->adminUserService->findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 删除管理员
     * @method post
     * @auth adminUserDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        $this->adminUserService->delete($request->post('id'), $request->adminUser->id);
        return success([], '删除成功');
    }

    /**
     * @log 管理员锁定状态修改
     * @method post
     * @auth adminUserUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request) : Response
    {
        $this->adminUserService->updateStatus($request->post());
        return success([], '操作成功');
    }

    /**
     * @log 修改自己的登录密码
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updatePassword(Request $request) : Response
    {
        $this->adminUserService->updatePassword($request->post(), $request->adminUser->id);
        return success([], '修改成功，请重新登录');
    }

    /**
     * 获取自己的资料
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getAdminUser(Request $request) : Response
    {
        $data = $this->adminUserService->getAdminUser($request->adminUser->id);
        return success($data);
    }

    /**
     * @log 修改自己的资料
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateInfo(Request $request) : Response
    {
        $this->adminUserService->updateInfo($request->post(), $request->adminUser->id);
        return success([], '修改成功');
    }
}
