<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 用户快捷菜单 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserShortcutMenuModel extends BaseModel
{

    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_user_shortcut_menu',
            'autoWriteTimestamp' => false,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'img' => '',
            ],
        ];
    }

    // admin_user_id 搜索器
    public function searchAdminUserIdAttr($query, $value, $data)
    {
        $query->where('admin_user_id', '=', $value);
    }


    // 所属用户 关联模型
    public function AdminUser()
    {
        return $this->belongsTo(AdminUserModel::class);
    }

    // 角色 关联模型
    public function AdminRole()
    {
        return $this->belongsTo(AdminRoleModel::class);
    }

    // 菜单 关联模型
    public function AdminRoleMenu()
    {
        return $this->belongsTo(AdminRoleMenuModel::class);
    }

    // 菜单 关联模型
    public function AdminMenu()
    {
        return $this->belongsTo(AdminMenuModel::class);
    }

}