<?php
namespace app\common\logic;

use app\common\model\AdminUserShortcutMenuModel;
use app\common\model\AdminRoleMenuModel;
use app\common\model\AdminMenuModel;
use app\common\model\AdminUserModel;
use think\facade\Db;

/**
 * 用户快捷菜单 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserShortcutMenuLogic
{

    /**
     * 列表
     * @param array $params get参数
     * */
    public static function getList(array $params = [])
    {
        return AdminUserShortcutMenuModel::withSearch(['admin_user_id'], $params)
            ->with(['AdminMenu'])
            ->order('sort desc')
            ->select();
    }

    /**
     * 获取我的所有的菜单列表
     * @param int $adminUserId 用户id
     */
    public static function getMenuList(int $adminUserId)
    {
        if ($adminUserId == 1) {
            return AdminMenuModel::field('*')
                ->order('sort asc,id desc')
                ->where('type', 'in', [1, 2, 3, 4])
                ->select();
        } else {
            $adminRoleId = AdminUserModel::where('id', $adminUserId)->value('admin_role_id');
            return AdminRoleMenuModel::alias('arm')
                ->join('AdminMenu am', 'arm.admin_menu_id = am.id')
                ->where('arm.admin_role_id', $adminRoleId)
                ->where('am.type', 'in', [1, 2, 3, 4])
                ->field('am.*')
                ->order('am.sort asc,am.id desc')
                ->select();
        }
    }

    /**
     * 更新
     * @param array $adminUserId 用户id
     * @param array $adminMenuIds 提交的菜单id
     */
    public static function update(int $adminUserId, array $adminMenuIds)
    {
        Db::startTrans();
        try {
            // 旧的菜单数据
            $oldAdminMenuIds = AdminUserShortcutMenuModel::where('admin_user_id', $adminUserId)->column('admin_menu_id');
            // 计算要删除的菜单
            $permissionsToDelete = array_diff($oldAdminMenuIds, $adminMenuIds);
            // 计算需要插入的菜单
            $permissionsToInsert = array_diff($adminMenuIds, $oldAdminMenuIds);

            // 删除不要的菜单
            if ($permissionsToDelete) {
                AdminUserShortcutMenuModel::where('admin_user_id', $adminUserId)
                    ->whereIn('admin_menu_id', $permissionsToDelete)
                    ->delete();
            }

            if ($adminUserId == 1) {
                // 插入新的菜单
                foreach ($permissionsToInsert as $v) {
                    $dataAll[] = [
                        'admin_user_id' => $adminUserId,
                        'admin_menu_id' => $v,
                    ];
                }
            } else {
                $adminUser = AdminUserModel::with([
                    'AdminRole.AdminRoleMenu'
                ])->find($adminUserId);

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
                        'admin_user_id'      => $adminUserId,
                        'admin_role_menu_id' => $adminRoleMenuId,
                        'admin_menu_id'      => $v,
                    ];
                }
            }
            isset($dataAll) && (new AdminUserShortcutMenuModel())->saveAll($dataAll);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改排序
     * @param int $adminUserId
     * @param array $params
     */
    public static function updateSort(int $adminUserId, array $params)
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
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
        return success([], '修改成功');
    }
}