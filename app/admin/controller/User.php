<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\UserLogic;

/**
 * 管理用户
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class User
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
     */
    public function getList(Request $request): Response
    {
        $list = UserLogic::getList($request->get());
        return success($list);
    }

    /**
     * @log 添加律师
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request): Response
    {
        UserLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * 搜索选择律师
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function selectUser(Request $request) : Response
    {
        $list = UserLogic::selectUser($request->get(name: 'keywords'), $request->get(name: 'user_id'));
        return success($list);
    }

    /**
     * @log 修改律师
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        UserLogic::udpate($request->post());
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
        $data = UserLogic::findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 删除律师
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request): Response
    {
        UserLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 律师锁定状态修改
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateStatus(Request $request): Response
    {
        UserLogic::updateStatus($request->post());
        return success([], '操作成功');
    }
}
