<?php
namespace app\common\model;

use think\model\concern\SoftDelete;

/**
 * word模板 模型
 *
 * @ author zy <741599086@qq.com>
 * */

class WordTemplateModel extends BaseModel
{
    use SoftDelete;

    // 表名
    protected $name = 'word_template';
    // 软删除
    protected $deleteTime = 'delete_time';
    // 自动时间戳
    protected $autoWriteTimestamp = true;

    // 字段类型转换
    protected $type = [
        'img' => 'json',
    ];

    // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
    protected $file = [
        'img' => '',
    ];


    // ID 搜索器
    public function searchIdAttr($query, $value, $data)
    {
        ($value != null) && $query->where('id', '=', $value);
    }

    // 标题 搜索器
    public function searchTitleAttr($query, $value, $data)
    {
        ($value != null) && $query->where('title', 'like', "%{$value}%");
    }

    // 简介 搜索器
    public function searchDescriptionAttr($query, $value, $data)
    {
        ($value != null) && $query->where('description', 'like', "%{$value}%");
    }

    // 状态 搜索器
    public function searchStatusAttr($query, $value, $data)
    {
        ($value != null) && $query->where('status', '=', $value);
    }

    // 内容 搜索器
    public function searchContentAttr($query, $value, $data)
    {
        ($value != null) && $query->where('content', 'like', "%{$value}%");
    }

    // 新增时间 搜索器
    public function searchCreateTimeAttr($query, $value, $data)
    {
        ($value && is_array($value)) && $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }


    // 所属用户 关联模型
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

}