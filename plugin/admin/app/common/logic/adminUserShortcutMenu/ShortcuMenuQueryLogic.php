<?php
namespace plugin\admin\app\common\logic\adminUserShortcutMenu;

use plugin\admin\app\common\model\AdminUserShortcutMenuModel;
use plugin\admin\app\common\model\AdminRoleMenuModel;
use plugin\admin\app\common\model\AdminMenuModel;
use plugin\admin\app\common\model\AdminUserModel;

/**
 * 用户快捷菜单 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ShortcuMenuQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * */
    public function getList(array $params = [])
    {
        return AdminUserShortcutMenuModel::withSearch(
            ['admin_user_id'],
            $params,
            true,
        )
            ->with(['AdminMenu'])
            ->order('sort desc')
            ->select();
    }

    /**
     * 获取我的所有的菜单列表
     * @param int $adminUserId 用户id
     */
    public function getMenuList(int $adminUserId)
    {
        $adminUser = AdminUserModel::find($adminUserId);
        if ($adminUser->is_super == 2) {
            return AdminMenuModel::field('*')
                ->order('sort asc,id desc')
                ->where('type', 'in', [1, 2, 3, 4, 7])
                ->select();
        } else {
            return AdminRoleMenuModel::alias('arm')
                ->join('AdminMenu am', 'arm.admin_menu_id = am.id')
                ->where('arm.admin_role_id', $adminUser->admin_role_id)
                ->where('am.type', 'in', [1, 2, 3, 4, 7])
                ->field('am.*')
                ->order('am.sort asc,am.id desc')
                ->select();
        }
    }

}