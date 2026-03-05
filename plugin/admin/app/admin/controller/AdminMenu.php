<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\service\AdminMenuService;

/**
 * 后台权限链接
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminMenu
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private AdminMenuService $adminMenuService,
    ) {}

    /**
     * 获取列表
     * @method get
     * @auth adminMenuGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->adminMenuService->getList($request->get());
        return success($list);
    }

    /**
     * @log 添加权限节点
     * @method post
     * @auth adminMenuCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->adminMenuService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改权限节点
     * @method post
     * @auth adminMenuUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->adminMenuService->update($request->post());
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
        $data = $this->adminMenuService->findData(intval($request->get('id')));
        return success($data);
    }

    /**
     * @log 删除权限节点
     * @method post
     * @auth adminMenuDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        $this->adminMenuService->delete(request()->post('id'));
        return success([], '删除成功');
    }
}
