<?php
namespace plugin\balance\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 用户余额明细 验证器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceDetailsValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'user_id|用户'        => 'require',
        'details_type|明细类型' => 'require',
        'title|标题'          => 'require',
        'change_value|变更值'  => 'require',
    ];

}