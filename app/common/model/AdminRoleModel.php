<?php
namespace app\common\model;


/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleModel extends BaseModel
{
    // 表名
    protected $name = 'admin_role';

    /**
     * 关联管理用户
     */
    public function AdminUser()
    {
        return $this->hasMany(AdminUserModel::class);
    }

    /**
     * 关联权限
     */
    public function AdminRoleMenu()
    {
        return $this->hasMany(AdminRoleMenuModel::class);
    }

    /**
     * 角色拥有的权限
     */
    public function AdminMenu()
    {
        return $this->belongsToMany(AdminMenuModel::class, AdminRoleMenuModel::class, 'admin_role_id', 'admin_menu_id');
    }

    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $value && $query->where('title', 'like', "%{$value}%");
        $query->where('id', '<>', 1);
    }

}