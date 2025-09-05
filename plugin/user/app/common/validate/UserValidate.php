<?php
namespace plugin\user\app\common\validate;

use taoser\Validate;

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
        'name|姓名'               => 'require',
        'tel|手机号'               => 'require|mobile|unique:User',

        'password|密码'           => 'require|min:6',
        'new_password|新密码'      => 'require|min:6',
        'confirm_password|再次输入' => 'require|min:6',
    ];

    // 验证场景
    protected $scene = [
        // 添加
        'create'          => ['name', 'tel'],
        // 修改密码
        'update_password' => ['password', 'new_password', 'confirm_password'],
    ];

}