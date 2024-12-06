<?php
namespace app\common\validate;

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
        'name|姓名' => 'require',
        'tel|手机号' => 'require|mobile|unique:User',
    ];

}