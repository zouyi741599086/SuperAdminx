<?php
namespace app\common\model;

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
}