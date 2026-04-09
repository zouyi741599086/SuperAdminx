<?php
namespace plugin\admin\app\common\logic\adminUserShortcutMenu;

use plugin\admin\app\common\model\AdminUserShortcutMenuModel;
use plugin\admin\app\common\model\AdminUserModel;
use think\facade\Db;

/**
 * 用户快捷菜单 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ShortcuMenuExecuteLogic
{

    /**
     * 更新
     * @param int $adminUserId 用户id
     * @param array $adminMenuIds 提交的菜单id
     */
    public function update(int $adminUserId, array $adminMenuIds)
    {
        $adminUser = AdminUserModel::with([
            'AdminRole.AdminRoleMenu',
        ])->find($adminUserId);

        Db::startTrans();
        try {
            // 旧的菜单数据
            $oldAdminMenuIds = AdminUserShortcutMenuModel::where('admin_user_id', $adminUser->id)->column('admin_menu_id');
            // 计算要删除的菜单
            $permissionsToDelete = array_diff($oldAdminMenuIds, $adminMenuIds);
            // 计算需要插入的菜单
            $permissionsToInsert = array_diff($adminMenuIds, $oldAdminMenuIds);

            // 删除不要的菜单
            if ($permissionsToDelete) {
                AdminUserShortcutMenuModel::where('admin_user_id', $adminUser->id)
                    ->whereIn('admin_menu_id', $permissionsToDelete)
                    ->delete();
            }

            if ($adminUser->is_super == 2) {
                // 插入新的菜单
                foreach ($permissionsToInsert as $v) {
                    $dataAll[] = [
                        'admin_user_id' => $adminUser->id,
                        'admin_menu_id' => $v,
                    ];
                }
            } else {
                // 插入新的菜单
                foreach ($permissionsToInsert as $v) {
                    // 找到菜单对角色的id
                    $adminRoleMenuId = 0;
                    foreach ($adminUser->AdminRole->AdminRoleMenu as $vv) {
                        if ($vv->admin_menu_id == $v) {
                            $adminRoleMenuId = $vv->id;
                            break;
                        }
                    }
                    $dataAll[] = [
                        'admin_user_id'      => $adminUser->id,
                        'admin_role_menu_id' => $adminRoleMenuId,
                        'admin_menu_id'      => $v,
                    ];
                }
            }
            isset($dataAll) && (new AdminUserShortcutMenuModel())->saveAll($dataAll);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改排序
     * @param int $adminUserId
     * @param array $params
     */
    public function updateSort(int $adminUserId, array $params)
    {
        Db::startTrans();
        try {
            $list = AdminUserShortcutMenuModel::where('admin_user_id', $adminUserId)->select();
            foreach ($params as $k => $v) {
                foreach ($list as $k1 => $v1) {
                    if ($v['admin_menu_id'] == $v1->admin_menu_id) {
                        $params[$k]['id'] = $v1->id;
                        unset($params[$k]['admin_menu_id']);
                        break;
                    }
                }
            }
            (new AdminUserShortcutMenuModel())->saveAll($params);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
        return success([], '修改成功');
    }
}