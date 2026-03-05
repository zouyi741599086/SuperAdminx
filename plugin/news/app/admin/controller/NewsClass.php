<?php
namespace plugin\news\app\admin\controller;

use support\Request;
use support\Response;
use plugin\news\app\common\service\NewsClassService;

/**
 * 文章分类管理
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClass
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private NewsClassService $newsClassService,
    ) {}

    /**
     * 获取列表
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getList(Request $request) : Response
    {
        $list = $this->newsClassService->getList();
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
        $data = $this->newsClassService->findData($id);
        return success($data);
    }

    /**
     * @log 添加文章分类
     * @method post
     * @auth newsClassCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->newsClassService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 显示隐藏文章分类
     * @method post
     * @auth newsClassUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request) : Response
    {
        $this->newsClassService->updateStatus($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 修改文章分类
     * @method post
     * @auth newsClassUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->newsClassService->update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除文章分类
     * @method post
     * @auth newsClassDelete
     * @param Request $request 
     * @param int $id
     * @return Response
     */
    public function delete(Request $request, int $id) : Response
    {
        $this->newsClassService->delete($id);
        return success([], '删除成功');
    }

    /**
     * @log 更改文章分类的排序
     * @method post
     * @auth newsClassUpdateSort
     * @param Request $request 
     * @param array $list
     * @return Response
     * */
    public function updateSort(Request $request, array $list) : Response
    {
        $this->newsClassService->updateSort($list);
        return success([], '操作成功');
    }

}
