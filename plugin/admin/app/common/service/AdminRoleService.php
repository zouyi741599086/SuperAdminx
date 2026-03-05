<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminRole\{AdminRoleExecuteLogic, AdminRoleQueryLogic};

/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleService
{

    public function __construct(
        private AdminRoleExecuteLogic $adminRoleExecuteLogic,
        private AdminRoleQueryLogic $adminRoleQueryLogic,
    ) {}

    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return $this->adminRoleQueryLogic->getList($params);
    }

    /**
     * 添加管理员角色
     * @param array $params
     */
    public function create(array $params)
    {
        $this->adminRoleExecuteLogic->create($params);
    }

    /**
     * 修改管理员角色
     * @param array $data
     */
    public function update($params = [])
    {
        $this->adminRoleExecuteLogic->update($params);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return $this->adminRoleQueryLogic->findData($id);
    }

    /**
     * 删除管理员角色
     * @param int $id
     */
    public function delete(int $id)
    {
        $this->adminRoleExecuteLogic->delete($id);
    }

    /**
     * 搜索选择某条数据
     * @param array $params 
     */
    public function selectAdminRole(array $params)
    {
        return $this->adminRoleQueryLogic->selectAdminRole($params);
    }

    /**
     * 获取某个角色的连接权限
     * @param int $id
     */
    public function getDataMenu(int $id)
    {
        return $this->adminRoleQueryLogic->getDataMenu($id);
    }

    /**
     * 修改角色的权限
     * @param array $params
     */
    public function updateDataMenu(array $params)
    {
        $this->adminRoleExecuteLogic->updateDataMenu($params);
    }
}