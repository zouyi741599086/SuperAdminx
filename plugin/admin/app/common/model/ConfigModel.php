<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigModel extends BaseModel
{
    // 表名
    protected $name = 'config';

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
        'content' => 'array',
    ];

    // 字段类型转换
    protected $type = [
        'content'       => 'json',
        'fields_config' => 'json',
    ];

    //类型 查询字段
    public function searchTypeAttr($query, $value, $data)
    {
        $query->where('type', '=', $value);
    }

    //英文名称 查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $query->where('name', 'like', "%{$value}%");
    }

    //配置名称 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }
}