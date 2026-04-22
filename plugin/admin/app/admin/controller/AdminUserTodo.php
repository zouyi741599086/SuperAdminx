<?php
namespace plugin\admin\app\admin\controller;

use plugin\admin\app\common\service\AdminUserTodoService;
use support\Request;
use support\Response;

/**
 * 待办事项 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserTodo
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private AdminUserTodoService $adminUserTodoService,
    ) {}

    /**
     * 列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $params                  = $request->get();
        $params['admin_user_id'] = $request->adminUser->id;
        $list                    = $this->adminUserTodoService->getList(params: $params, page: false)->select();
        return success($list);
    }

    /**
     * 获取某月待办事项数量
     * @method get
     * @param Request $request 
     * @param string $start_date 开始时间
     * @param string $end_date 结束时间
     * @return Response
     */
    public function getMonthCount(Request $request, ?string $start_date = null, ?string $end_date = null) : Response
    {
        $list = $this->adminUserTodoService->getMonthCount($request->adminUser->id, $start_date, $end_date);
        return success($list);
    }

    /**
     * @log 新增待办事项
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->adminUserTodoService->create($request->post(), $request->adminUser->id);
        return success([], '添加成功');
    }

    /**
     * 获取数据
     * @method get
     * @param Request $request 
     * @param int $id 
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = $this->adminUserTodoService->findData($id);
        return success($data);
    }

    /**
     * @log 修改待办事项
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->adminUserTodoService->update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 修改待办事项状态
     * @method post
     * @param Request $request 
     * @param int $id 数据id
     * @param int $status 数据状态 
     * @return Response
     */
    public function updateStatus(Request $request, int $id, int $status) : Response
    {
        $this->adminUserTodoService->updateStatus($id, $status);
        return success();
    }

    /**
     * @log 删除待办事项
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        $this->adminUserTodoService->delete($request->post('id'));
        return success([], '删除成功');
    }
}