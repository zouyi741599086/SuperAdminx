<?php
namespace plugin\admin\app\common\logic\adminRole;

use plugin\admin\app\common\model\AdminRoleModel;
use plugin\admin\app\common\model\AdminUserModel;
use plugin\admin\app\common\model\AdminRoleMenuModel;
use plugin\admin\app\common\validate\AdminRoleValidate;
use think\facade\Db;

/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleExecuteLogic
{

    /**
     * 添加管理员角色
     * @param array $params
     */
    public function create(array $params)
    {
        try {
            think_validate(AdminRoleValidate::class)->check($params);

            AdminRoleModel::create($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改管理员角色
     * @param array $data
     */
    public function update($params = [])
    {
        try {
            think_validate(AdminRoleValidate::class)->check($params);

            AdminRoleModel::update($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除管理员角色
     * @param int $id
     */
    public function delete(int $id)
    {
        if (AdminUserModel::where('admin_role_id', $id)->find()) {
            abort('此角色下还绑定有管理员，不允许删除~');
        }
        AdminRoleModel::destroy($id);
    }

    /**
     * 修改角色的权限
     * @param array $params
     */
    public function updateDataMenu(array $params)
    {
        Db::startTrans();
        try {
            $oldAdminMenuId = AdminRoleMenuModel::where('admin_role_id', $params['id'])->column('admin_menu_id');
            // 计算要删除的权限节点
            $permissionsToDelete = array_diff($oldAdminMenuId, $params['admin_menu_id']);
            // 计算需要插入的权限节点
            $permissionsToInsert = array_diff($params['admin_menu_id'], $oldAdminMenuId);

            // 删除不要的权限节点
            if ($permissionsToDelete) {
                AdminRoleMenuModel::where('admin_role_id', $params['id'])->whereIn('admin_menu_id', $permissionsToDelete)->delete();
            }

            // 插入权限节点
            foreach ($permissionsToInsert as $v) {
                $admin_role_menu[] = [
                    'admin_role_id' => $params['id'],
                    'admin_menu_id' => $v,
                ];
            }
            if (isset($admin_role_menu)) {
                (new AdminRoleMenuModel())->saveAll($admin_role_menu);
            }
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}