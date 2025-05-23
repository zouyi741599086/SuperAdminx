<?php
namespace app\admin\controller;

use support\Request;
use support\Response;

use app\common\logic\UserLogic;

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

    /**
     * 列表
     * @method get
     * @auth userGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = UserLogic::getList($request->get());
        return success($list);
    }

    /**
     * 获取数据
     * @method get
     * @param int $id 
     * @return Response
     */
    public function findData(int $id): Response
    {
        $data = UserLogic::findData($id);
        return success($data);
    }

    /**
     * @log 修改用户
     * @method post
     * @auth userUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request): Response
    {
        UserLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * 搜索选择某条数据
     * @method get
     * @param string $keywords 搜索的关键字
     * @param int $id 选中的数据id
     * @return Response
     */
    public function selectUser(string $keywords = null, int $id = null): Response
    {
        $list = UserLogic::selectUser($keywords, $id);
        return success($list);
    }

    /**
     * @log 导出用户数据
     * @method get
     * @auth userExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request): Response
    {
        $data = UserLogic::exportData($request->get());
        return success($data);
    }

    /**
     * @log 查询推广关系
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function invitations(Request $request): Response
    {
        $data = UserLogic::invitations($request->get());
        return success($data);
    }

}