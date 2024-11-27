<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\NewsLogic;

/**
 * 文章管理
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class News
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * 获取列表
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getList(Request $request): Response
    {
        $list = NewsLogic::getList($request->get());
        return success($list);
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function findData(Request $request): Response
    {
        $data = NewsLogic::findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 添加文章
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request): Response
    {
        NewsLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改文章
     * @method post
     * @auth news
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        NewsLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 显示隐藏文章
     * @method post
     * @auth newsUpdateStatus
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request): Response
    {
        NewsLogic::updateStatus($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除文章
     * @method post
     * @auth newsDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request): Response
    {
        NewsLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 批量操作复制文章或修改分类
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateAll(Request $request): Response
    {
        NewsLogic::updateAll($request->post());
        return success([], '操作成功');
    }


    /**
     * 更改排序
     * @method post
     * @auth newsUpdateSort
     * @param Request $request 
     * @return Response
     * */
    public function updateSort(Request $request): Response
    {
        NewsLogic::updateSort($request->post('list'));
        return success([], '修改成功');
    }

}
