<?php
namespace plugin\balance\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 余额提现 验证器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceWithdrawValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'money|提现金额'        => 'require',
        'bank_name|姓名'      => 'require',
        'bank_title|银行'     => 'require',
        'bank_number|银行卡号'  => 'require',
        'balance_type|提现资产类型' => 'require',
    ];

}