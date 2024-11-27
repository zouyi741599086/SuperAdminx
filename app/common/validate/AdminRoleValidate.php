<?php
namespace app\common\validate;

use taoser\Validate;

/**
 * 角色
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class AdminRoleValidate extends Validate
{

    protected $rule = [
        'title' => 'require',
    ];

    protected $message = [
        'title.require' => '请输入角色名称',
    ];

}


