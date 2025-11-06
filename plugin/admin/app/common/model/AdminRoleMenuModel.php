<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;
use think\model\Pivot;

/**
 * 后台管理用户 权限 中间表
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleMenuModel extends Pivot
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_role_menu',
            'autoWriteTimestamp' => false,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

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