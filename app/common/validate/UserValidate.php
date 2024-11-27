<?php
namespace app\common\validate;

use taoser\Validate;

/**
 * 用户
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class UserValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'name|姓名'               => 'require',
        'tel|手机号'               => 'require|unique:User',
        'password|登录密码'         => 'require',
        'new_password|新密码'      => 'require|min:6',
        'confirm_password|再次输入' => 'require|min:6|confirm:new_password',
    ];

    // create 新增
    public function sceneCreate()
    {
        return $this->only(['name', 'tel', 'password']);
    }

    // update 更新
    public function sceneUpdate()
    {
        return $this->only(['name', 'tel']);
    }

    // updatePassword 修改密码
    public function sceneUpdatePassword()
    {
        return $this->only(['password', 'new_password', 'confirm_password']);
    }

    // updateInfo 修改信息
    public function sceneUpdateInfo()
    {
        return $this->only(['name', 'tel']);
    }

}