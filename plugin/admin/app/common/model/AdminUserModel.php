<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 后台用户模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_user',
            'autoWriteTimestamp' => true,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'img' => '',
            ],
        ];
    }

    // 修改器
    public function setPasswordAttr($value)
    {
        return password_hash($value, PASSWORD_DEFAULT);
    }

    /**
     * 用户所属角色
     */
    public function AdminRole()
    {
        return $this->belongsTo(AdminRoleModel::class);
    }

    // 查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $query->where('name', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchTelAttr($query, $value, $data)
    {
        $query->where('tel', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchUsernameAttr($query, $value, $data)
    {
        $query->where('username', 'like', "%{$value}%");
    }
    //查询字段
    public function searchAdminRoleIdAttr($query, $value, $data)
    {
        $query->where('admin_role_id', '=', $value);
    }
    // 查询字段
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', '=', $value);
    }
}