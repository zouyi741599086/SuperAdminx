<?php
namespace plugin\balance\app\common\logic\balanceWithdraw;

use plugin\balance\app\common\model\BalanceWithdrawModel;
use plugin\balance\app\common\validate\BalanceWithdrawValidate;
use support\think\Db;

/**
 * 新增提现
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WithdrawExecuteLogic
{
   
    /**
     * 新增，申请提现
     * @param array $params
     */
    public function create(array $params, )
    {
        think_validate(BalanceWithdrawValidate::class)->check($params);

        // 提现的相关配置
        $balanceWithdrawConfig = get_config('balance_withdraw_config');
        if ($params['money'] < $balanceWithdrawConfig->min_money) {
            abort('提现金额不能低于' . $balanceWithdrawConfig->min_money);
        }

        // 判断提现的资产类型是否允许提现
        $balanceType       = config('plugin.balance.superadminx.balance_type');
        $balanceTypeConfig = [];
        foreach ($balanceType as $v) {
            if ($v['field'] == $params['balance_type']) {
                $balanceTypeConfig = $v;
                break;
            }
        }
        if ($balanceTypeConfig['withdraw'] == false) {
            abort('非法请求');
        }

        Db::startTrans();
        try {
            // 减少余额
            balance_change(
                $params['user_id'],
                -$params['money'],
                $params['balance_type'],
                'money_balance_withdraw',
                '提现申请',
            );

            $params['shouxufei'] = d2($params['money'] * $balanceWithdrawConfig->shouxufei_bili / 100);
            $params['on_money']  = $params['money'] - $params['shouxufei'];
            $params['orderno']   = get_order_no('TX');

            BalanceWithdrawModel::create($params);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}