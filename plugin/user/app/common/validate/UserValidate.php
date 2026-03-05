<?php
namespace plugin\user\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 用户 验证器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'name' => 'require',
        'tel'  => 'require|mobile|unique:User',
    ];

    protected $message = [
        'name.require' => '请输入姓名',
        'tel.require'  => '请输入手机号',
        'tel.mobile'   => '手机号格式错误',
        'tel.unique'   => '手机号已存在',
    ];

}