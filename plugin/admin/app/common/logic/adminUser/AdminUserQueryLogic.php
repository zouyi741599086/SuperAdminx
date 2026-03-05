<?php
namespace plugin\admin\app\common\logic\adminUser;

use plugin\admin\app\common\model\AdminUserModel;
use plugin\admin\app\common\model\AdminMenuModel;
use plugin\admin\app\common\model\AdminRoleMenuModel;

/**
 * 后台用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserQueryLogic
{

    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return AdminUserModel::withSearch(
            ['name', 'tel', 'admin_role_id', 'username', 'status'],
            $params,
            true,
        )
            ->where('id', '<>', 1)
            ->with(['AdminRole'])
            ->order('id desc')
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return AdminUserModel::find($id);
    }

    /**
     * 获取用户的资料，主要是包括权限节点
     * @param int $adminUserId
     * @return array
     */
    public function getAdminUser(int $adminUserId) : array
    {
        $data = AdminUserModel::with(['AdminRole'])
            ->find($adminUserId)
            ->toArray();

        // 用户拥有的权限节点
        if ($data['id'] == 1) {
            $data['menu'] = AdminMenuModel::field('*')
                ->order('sort asc,id desc')
                ->select();
        } else {
            $data['menu'] = AdminRoleMenuModel::alias('arm')
                ->join('AdminMenu am', 'arm.admin_menu_id = am.id')
                ->where('arm.admin_role_id', $data['admin_role_id'])
                ->field('am.*')
                ->order('am.sort asc,am.id desc')
                ->select();
        }
        return $data;
    }
}