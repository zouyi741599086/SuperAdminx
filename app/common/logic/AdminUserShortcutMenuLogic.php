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
        ->order('sort asc,id desc')
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
                ->where('type', 'in', [1,2,3,4])
                ->select();
        } else {
            $adminRoleId = AdminUserModel::where('id', $adminUserId)->value('admin_role_id');
            return AdminRoleMenuModel::alias('arm')
                ->join('AdminMenu am', 'arm.admin_menu_id = am.id')
                ->where('arm.admin_role_id', $adminRoleId)
                ->where('am.type', 'in', [1,2,3,4])
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
            // 要插入的数据
            $dataAll = [];
            // 旧数据，为了插入新数据的时候要保留旧数据的排序
            $oldDataList = AdminUserShortcutMenuModel::where('admin_user_id', $adminUserId)->select();

            if ($adminUserId == 1) {
                foreach ($adminMenuIds as $v) {
                    // 保留旧数据的排序
                    $sort = 0;
                    foreach ($oldDataList as $vv) {
                        if ($vv['admin_menu_id'] == $v) {
                            $sort = $vv['sort'];
                            break;
                        }
                    }

                    $dataAll[] = [
                        'admin_user_id' => $adminUserId,
                        'admin_menu_id' => $v,
                        'sort'          => $sort,
                    ];
                }
            } else {
                $adminUser = AdminUserModel::with([
                    'AdminRole.AdminRoleMenu'
                ])->find($adminUserId);

                foreach ($adminMenuIds as $v) {
                    // 找到菜单对角色的id
                    $adminRoleMenuId = 0;
                    foreach ($adminUser->AdminRole->AdminRoleMenu as $vv) {
                        if ($vv->admin_menu_id == $v) {
                            $adminRoleMenuId  = $vv->id;
                            break;
                        }
                    }

                    // 保留旧数据的排序
                    $sort = 0;
                    foreach ($oldDataList as $vv) {
                        if ($vv['admin_menu_id'] == $v) {
                            $sort = $vv['sort'];
                            break;
                        }
                    }

                    if ($adminRoleMenuId) {
                        $dataAll[] = [
                            'admin_user_id'         => $adminUserId,
                            'admin_role_id'         => $adminUser->admin_role_id,
                            'admin_menu_id'         => $v,
                            'admin_role_menu_id'    => $adminRoleMenuId,
                            'sort'                  => $sort,
                        ];
                    }
                }
            }

            // 先删除旧数据
            AdminUserShortcutMenuModel::where('admin_user_id', $adminUserId)->delete();
            $dataAll && (new AdminUserShortcutMenuModel())->saveAll($dataAll);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}