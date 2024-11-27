<?php
namespace app\common\model;

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

    // 修改器
    public function setPasswordAttr($value)
    {
        return password_hash($value, PASSWORD_DEFAULT);
    }

    // 昵称 搜索器
    public function searchNameAttr($query, $value, $data)
    {
        ($value != null) && $query->where('name', 'like', "%{$value}%");
    }

    // 手机号 搜索器
    public function searchTelAttr($query, $value, $data)
    {
        ($value != null) && $query->where('tel', 'like', "%{$value}%");
    }

    // 状态 搜索器
    public function searchStatusAttr($query, $value, $data)
    {
        ($value != null) && $query->where('status', '=', $value);
    }

    // 添加时间 搜索器
    public function searchCreateTimeAttr($query, $value, $data)
    {
        ($value && is_array($value)) && $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }


}