<?php
namespace plugin\admin\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 后台菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class AdminMenuValidate extends Validate
{

    protected $rule = [
        'title' => 'require',
        'type'  => 'require|in:1,2,3,4,5,6,7',
        'name'  => 'require|unique:AdminMenu',
    ];

    protected $message = [
        'title.require' => '请输入菜单名称',
        'type.require'  => '请选择类型',
        'type.in'       => '非法的类型值',
        'name.require'  => '请输入权限英文名',
        'name.unique'   => '权限英文名已存在',
    ];

}


