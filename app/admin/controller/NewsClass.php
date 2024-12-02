<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\NewsClassLogic;

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

    /**
     * 获取列表
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getList(Request $request) : Response
    {
        $list = NewsClassLogic::getList();
        return success($list);
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function findData(Request $request) : Response
    {
        $data = NewsClassLogic::findData($request->get('id'));
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
        NewsClassLogic::create($request->post());
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
        NewsClassLogic::updateStatus($request->post());
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
        NewsClassLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除文章分类
     * @method post
     * @auth newsClassDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        NewsClassLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 更改文章分类的排序
     * @method post
     * @auth newsClassUpdateSort
     * @param Request $request 
     * @return Response
     * */
    public function updateSort(Request $request) : Response
    {
        NewsClassLogic::updateSort($request->post('list'));
        return success([], '操作成功');
    }

}
