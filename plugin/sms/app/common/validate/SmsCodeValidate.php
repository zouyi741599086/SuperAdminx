<?php
namespace plugin\sms\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 验证码
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class SmsCodeValidate extends Validate
{

    protected $rule = [
        'tel'  => 'require|mobile',
        'type' => 'require',
    ];

    protected $message = [
        'tel.require'  => '手机号为空',
        'tel.mobile'   => '手机号格式错误',
        'type.require' => '验证码类型为空',
    ];

    protected $scene = [
        'tel' => ['tel'],
    ];
}


