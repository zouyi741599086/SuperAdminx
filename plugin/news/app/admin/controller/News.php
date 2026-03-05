<?php
namespace plugin\news\app\admin\controller;

use support\Request;
use support\Response;
use plugin\news\app\common\service\NewsService;

/**
 * 文章管理
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class News
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private NewsService $newsService,
    ) {}

    /**
     * 获取列表
     * @method get
     * @auth newsGetList
     * @param Request $request 
     * @return Response
     * */
    public function getList(Request $request) : Response
    {
        $with = ['newsClass'];
        $list = $this->newsService->getList($request->get(), $with);
        return success($list);
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @param int $id
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = $this->newsService->findData($id);
        return success($data);
    }

    /**
     * @log 添加文章
     * @method post
     * @auth newsCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->newsService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改文章
     * @method post
     * @auth newsUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->newsService->update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 修改文章状态
     * @method post
     * @auth newsUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request) : Response
    {
        $this->newsService->updateStatus($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除文章
     * @method post
     * @auth newsDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        $this->newsService->delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 批量操作复制文章或修改分类
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateAll(Request $request) : Response
    {
        $this->newsService->updateAll($request->post());
        return success([], '操作成功');
    }

    /**
     * 更改排序
     * @method post
     * @auth newsUpdateSort
     * @param Request $request 
     * @param array $list
     * @return Response
     * */
    public function updateSort(Request $request, array $list) : Response
    {
        $this->newsService->updateSort($list);
        return success([], '修改成功');
    }

}
