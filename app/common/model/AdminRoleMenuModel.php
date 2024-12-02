<?php
namespace app\common\model;

use think\model\Pivot;

/**
 * 后台管理用户 权限 中间表
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleMenuModel extends Pivot
{
    // 自动时间戳
    protected $autoWriteTimestamp = false;

    // 表名
    protected $name = 'admin_role_menu';

    /**
     * 角色
     */
    public function AdminRole()
    {
        return $this->belongsTo(AdminRoleModel::class);
    }

    /**
     * 菜单
     */
    public function AdminMenu()
    {
        return $this->belongsTo(AdminMenuModel::class);
    }
}