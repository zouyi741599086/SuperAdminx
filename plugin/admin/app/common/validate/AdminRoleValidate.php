<?php
namespace plugin\admin\app\common\validate;

use superadminx\think_validate\Validate;

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


