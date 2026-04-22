<?php
namespace plugin\admin\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 待办事项 验证器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserTodoValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'admin_user_id' => 'require',
        'date'          => 'require',
        'content'       => 'require',
    ];

    protected $message = [
        'admin_user_id.require' => '参数错误',
        'date.require'          => '请选中日期',
        'content.require'       => '请输入内容',
    ];

}