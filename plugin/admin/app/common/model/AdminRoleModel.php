<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_role',
            'autoWriteTimestamp' => true,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

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
        $query->where('title', 'like', "%{$value}%");
    }

}