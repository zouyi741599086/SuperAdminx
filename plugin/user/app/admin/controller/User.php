<?php
namespace plugin\user\app\admin\controller;

use support\Request;
use support\Response;
use plugin\user\app\common\service\UserService;

/**
 * 用户 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class User
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private UserService $userService,
    ) {}

    /**
     * 列表
     * @method get
     * @auth userGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->userService->getList($request->get());
        return success($list);
    }

    /**
     * 获取数据
     * @method get
     * @param int $id 
     * @return Response
     */
    public function findData(int $id) : Response
    {
        $data = $this->userService->findData($id);
        return success($data);
    }

    /**
     * @log 新增用户
     * @method post
     * @auth userCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {

        $this->userService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改用户
     * @method post
     * @auth userUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->userService->update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 用户状态修改
     * @method post
     * @auth userUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request) : Response
    {
        $params = $request->post();
        $this->userService->updateStatus($params['id'], $params['status']);
        return success([], '操作成功');
    }

    /**
     * 搜索选择某条数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function selectUser(Request $request) : Response
    {
        $list = $this->userService->selectUser($request->get());
        return success($list);
    }

    /**
     * @log 导出用户数据
     * @method get
     * @auth userExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $data = $this->userService->exportData($request->get());
        return success($data);
    }

    /**
     * @log 查询推广关系
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function invitations(Request $request) : Response
    {
        $data = $this->userService->invitations($request->get());
        return success($data);
    }

    /**
     * 查用户的上级路劲
     * @method get
     * @param Request $request 
     * @param int $id 用户id
     * @return Response
     */
    public function selectPidPathUser(Request $request, int $id) : Response
    {
        $list = $this->userService->getPidUser($id, true);
        return success(array_reverse($list));
    }

}