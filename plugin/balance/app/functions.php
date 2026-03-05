<?php

use plugin\balance\app\common\logic\balance\BalanceUpdateLogic;
use plugin\balance\app\common\logic\balance\BalanceQueryLogic;
use support\Container;


/**
 * 变更用户余额
 * @param int $userId 用户id
 * @param float|int $changeValue 变化的值，正数为加，负数为减少
 * @param string $balanceType 余额类型，看config/superadminx.php里面的余额配置
 * @param string $detailType 明细变动类型，看config/superadminx.php里面的余额配置
 * @param string $title 变更的原因
 * @param bool $isNegative 是否允许修改为负数
 * @return void
 */
function balance_change(int $userId, float|int $changeValue, string $balanceType, string $detailsType, string $title, bool $isNegative = false, ) : void
{
    if ($changeValue != 0) {
        $params             = [
            'user_id'      => $userId,
            'change_value' => $changeValue,
            'balance_type' => $balanceType,
            'details_type' => $detailsType,
            'title'        => $title,
            'isNegative'   => $isNegative,
        ];
        $balanceUpdateLogic = Container::get(BalanceUpdateLogic::class);
        $balanceUpdateLogic->updateBalance($params);
    }
}

/**
 * 获取用户的余额
 * @param int $userId
 * @param string $balanceType 余额类型，看config/superadminx.php里面的余额配置
 * @return mixed
 */
function balance_get(int $userId, ?string $balanceType = null)
{
    $balance = (new BalanceQueryLogic())->getUserBalance($userId);
    if ($balanceType) {
        return $balance[$balanceType] ?? 0;
    }
    return $balance;
}
