<?php
namespace app\common\model;


/**
 * 后台用户模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserModel extends BaseModel
{
    //表名
    protected $name = 'admin_user';

    protected $dateFormat = 'Y-m-d H:i:s';
    protected $type       = [
        'last_time' => 'timestamp',
    ];


    //包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
        'img' => '',
    ];

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

    //查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $value && $query->where('name', 'like', "%{$value}%");
        $query->where('id', '<>', 1);
    }
    //查询字段
    public function searchTelAttr($query, $value, $data)
    {
        $value && $query->where('tel', 'like', "%{$value}%");
    }
    //查询字段
    public function searchUsernameAttr($query, $value, $data)
    {
        $value && $query->where('username', 'like', "%{$value}%");
    }
    //查询字段
    public function searchAdminRoleIdAttr($query, $value, $data)
    {
        $value && $query->where('admin_role_id', '=', $value);
    }
    //查询字段
    public function searchStatusAttr($query, $value, $data)
    {
        $value && $query->where('status', '=', $value);
    }


}