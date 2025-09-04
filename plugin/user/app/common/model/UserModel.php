<?php
namespace plugin\user\app\common\model;

use app\common\model\BaseModel;

/**
 * 用户 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserModel extends BaseModel
{

    // 表名
    protected $name = 'user';

    // 自动时间戳
    protected $autoWriteTimestamp = true;

    // 字段类型转换
    protected $type = [
    ];

    // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
    protected $file = [
        'img' => '',
    ];

    //密码 修改器
    public function setPasswordAttr($value)
    {
        return password_hash($value, PASSWORD_DEFAULT);
    }

    // 姓名 搜索器
    public function searchNameAttr($query, $value, $data)
    {
        $query->where('name', 'like', "%{$value}%");
    }

    // 手机号 搜索器
    public function searchTelAttr($query, $value, $data)
    {
        $query->where('tel', 'like', "%{$value}%");
    }

    // 状态 搜索器
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', '=', $value);
    }

    // 上级用户 搜索器
    public function searchPidAttr($query, $value, $data)
    {
        $query->where('pid', '=', $value);
    }

    // 注册时间 搜索器
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

    // 上级用户 关联模型
    public function PUser()
    {
        return $this->belongsTo(UserModel::class, 'pid');
    }

    // 下级用户 关联模型
    public function NextUser()
    {
        return $this->hasMany(UserModel::class, 'pid');
    }

}