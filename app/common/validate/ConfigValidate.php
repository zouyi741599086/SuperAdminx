<?php
namespace app\common\validate;

use taoser\Validate;

/**
 * 参数设置
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class ConfigValidate extends Validate
{
    protected $rule = [
        'title' => 'require',
        'name' => 'require|unique:config'
    ];

    protected $message = [
        'title.require' => '请输入中文配置名称',
        'name.require' => '请输入英文配置名称',
        'name.unique' => '英文配置名称已存在',
    ];


}


