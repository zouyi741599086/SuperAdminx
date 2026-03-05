<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\user\app\common\model\UserModel;
use support\think\Db;

/**
 * 用户余额转账
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceTurnLogic
{

    /**
     * 账户转账
     * @param array $params
     * @return void
     */
    public function turn(array $params): void
    {
        think_validate([
            'user_id|转出账户'      => 'require',
            'to_user_id|转入账户'   => 'require',
            'value|转账金额'        => 'require|number|gt:0',
            'balance_type|余额类型' => 'require',
        ])->check($params);

        if ($params['user_id'] == $params['to_user_id']) {
            throw new \Exception("不能转给自己");
        }

        $userTel   = UserModel::where('id', $params['user_id'])->value('tel');
        $toUserTel = UserModel::where('id', $params['to_user_id'])->value('tel');

        Db::startTrans();
        try {
            // 减少余额
            balance_change(
                $params['user_id'],
                $params['value'] * -1,
                $params['balance_type'],
                "{$params['balance_type']}_turn",
                "转出给用户{$toUserTel}",
            );

            // 增加余额
            balance_change(
                $params['to_user_id'],
                $params['value'],
                $params['balance_type'],
                "{$params['balance_type']}_turn",
                "来自用户{$userTel}转账",
            );
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}