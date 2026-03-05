<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminUser\{AdminUserExecuteLogic, AdminUserQueryLogic};

/**
 * 后台用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserService
{

    public function __construct(
        private AdminUserExecuteLogic $adminUserExecuteLogic,
        private AdminUserQueryLogic $adminUserQueryLogic,
    ) {}

    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return $this->adminUserQueryLogic->getList($params);
    }

    /**
     * 添加管理员
     * @param array $params
     */
    public function create(array $params)
    {
        $this->adminUserExecuteLogic->create($params);
    }

    /**
     * 修改管理员
     * @param array $params
     */
    public function udpate(array $params)
    {
        $this->adminUserExecuteLogic->update($params);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return $this->adminUserQueryLogic->findData($id);
    }

    /**
     * 删除管理员
     * @param int $id 要删除的用户
     * @param int $adminUserId 当前登录的用户
     */
    public function delete(int $id, int $adminUserId)
    {
        $this->adminUserExecuteLogic->delete($id, $adminUserId);
    }

    /**
     * 管理员锁定状态修改
     * @param array $data
     */
    public function updateStatus(array $data)
    {
        $this->adminUserExecuteLogic->updateStatus($data);
    }

    /**
     * 修改自己的登录密码
     * @param array $data
     * @param int $adminUserId 当前登录用户的id
     */
    public function updatePassword(array $data, int $adminUserId)
    {
        $this->adminUserExecuteLogic->updatePassword($data, $adminUserId);
    }

    /**
     * 修改自己的资料
     * @param array $data
     * @param int $adminUserId 要修改的id，就是当前登录用户的id
     */
    public function updateInfo(array $data, int $adminUserId)
    {
        $this->adminUserExecuteLogic->updateInfo($data, $adminUserId);
    }

    /**
     * 获取用户的资料，主要是包括权限节点
     * @param int $adminUserId
     * @return array
     */
    public function getAdminUser(int $adminUserId) : array
    {
        return $this->adminUserQueryLogic->getAdminUser($adminUserId);
    }
}