<?php
namespace app\common\validate;

use taoser\Validate;

/**
 * 管理员
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class AdminUserValidate extends Validate
{

    protected $rule = [
        'name'             => 'require',
        'tel'              => 'require|mobile',
        'username'         => 'require|min:3|unique:AdminUser',
        'password'         => 'require|min:6',
        'admin_role_id'    => 'require',

        'new_password'     => 'require|min:6',
        'confirm_password' => 'require|min:6',
    ];

    protected $message = [
        'name.require'             => '请输入姓名',
        'tel.require'              => '请输入手机号',
        'tel.mobile'               => '请输入正确的手机号',
        'username.require'         => '请输入帐号',
        'username.min'             => '帐号最少输入3位',
        'username.unique'          => '登录帐号已存在，不能重复',
        'password.require'         => '请输入密码',
        'password.min'             => '密码最少输入6位',
        'admin_role_id.require'    => '请选择角色',

        'new_password.require'     => '请新输入密码',
        'new_password.min'         => '新密码最少输入6位',
        'confirm_password.require' => '请再次输入新输入密码',
        'confirm_password.min'     => '新密码最少输入6位',
    ];

    // 验证场景
    protected $scene = [
        // 添加
        'create'          => ['name', 'tel', 'username', 'password', 'admin_role_id'],
        // 修改
        'update'          => ['username', 'admin_role_id', 'name', 'tel'],
        // 修改密码
        'update_password' => ['new_password', 'confirm_password'],
        // 用户修改自己的资料
        'update_info'     => ['name', 'tel'],
    ];

}


