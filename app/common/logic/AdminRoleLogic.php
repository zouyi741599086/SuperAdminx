<?php
namespace app\common\logic;

use app\common\model\AdminRoleModel;
use app\common\model\AdminUserModel;
use app\common\model\AdminRoleMenuModel;
use app\common\validate\AdminRoleValidate;
use think\facade\Db;

/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleLogic
{
    /**
     * 获取列表
     * @param array $params
     */
    public static function getList(array $params)
    {
        // 不需要翻页的时候，如添加用户的时候选择角色
        if (isset($params['isPage']) && $params['isPage'] == 'no') {
            return AdminRoleModel::withSearch(['title'], $params)
                ->where('id', '<>', 1)
                ->order('id desc')
                ->select();
        }

        return AdminRoleModel::withSearch(['title'], $params)
            ->order('id desc')
            ->where('id', '<>', 1)
            ->withCount([
                'AdminUser',
                'AdminRoleMenu',
                'AdminMenu'
            ])->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 添加管理员角色
     * @param array $params
     */
    public static function create(array $params)
    {
        try {
            validate(AdminRoleValidate::class)->check($params);

            AdminRoleModel::create($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改管理员角色
     * @param array $data
     */
    public static function update($params = [])
    {
        try {
            validate(AdminRoleValidate::class)->check($params);

            AdminRoleModel::update($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        return AdminRoleModel::find($id);
    }

    /**
     * 删除管理员角色
     * @param int $id
     */
    public static function delete(int $id)
    {
        if (AdminUserModel::where('admin_role_id', $id)->find()) {
            abort('此角色下还绑定有管理员，不允许删除~');
        }
        AdminRoleModel::destroy($id);
    }

    /**
     * 获取某个角色的连接权限
     * @param int $id
     */
    public static function getDataMenu(int $id)
    {
        return AdminRoleModel::with(['AdminRoleMenu'])->find($id);
    }

    /**
     * 修改角色的权限
     * @param array $params
     */
    public static function updateDataMenu(array $params)
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
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}