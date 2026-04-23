<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\balance\app\common\validate\BalanceDetailsValidate;
use plugin\balance\app\common\logic\balanceDetails\DetailsExecuteLogic;
use support\think\Db;

/**
 * 用户余额 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceUpdateLogic
{

    public function __construct(
        private DetailsExecuteLogic $detailsExecuteLogic,
    ) {}

    /**
     * 变更用户余额
     * @param array $params
     * @return void
     */
    public function updateBalance(array $params) : void
    {
        Db::startTrans();
        try {
            think_validate(BalanceDetailsValidate::class)->check($params);

            if ($params['change_value'] == 0) {
                throw new \Exception("变更余额的值不能等于0");
            }

            // 减少余额 同时不允许修改为负数
            if ($params['change_value'] < 0) {
                // 如果不允许负余额，则需要检查余额是否足够
                if (! isset($params['isNegative']) || $params['isNegative'] == false) {
                    $userBalance = balance_get($params['user_id']);
                    if (($params['change_value'] * -1) > $userBalance[$params['balance_type']]) {
                        $tmp = $this->findBalanceType($params['balance_type']);
                        throw new \Exception("{$tmp['title']}不足");
                    }
                }
            }

            // 有数据则更新，没得则新增
            $dbPrefix = getenv('DB_PREFIX');
            $dateTime = date('Y-m-d H:i:s');
            Db::execute(
                "INSERT INTO `{$dbPrefix}balance` (`user_id`, `{$params['balance_type']}`, `create_time`, `update_time`) 
                    VALUES (?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE 
                    `{$params['balance_type']}` = `{$params['balance_type']}` + ?,`update_time` = ?
                    ",
                [
                    $params['user_id'],
                    $params['change_value'],
                    $dateTime,
                    $dateTime,
                    $params['change_value'],
                    $dateTime,
                ],
            );

            // 增加明细，先判断是否有明细
            $balanceTypeList = config('plugin.balance.superadminx.balance_type', 'array');
            foreach ($balanceTypeList as $key => $value) {
                if ($value['field'] == $params['balance_type'] && $value['details']) {
                    $this->detailsExecuteLogic->create($params);
                    break;
                }
            }

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 查找余额类型
     * @param string $balanceType
     * @return mixed
     */
    public function findBalanceType(string $balanceType)
    {
        $balanceTypeList = config('plugin.balance.superadminx.balance_type');
        $result          = null;
        foreach ($balanceTypeList as $v) {
            if ($v['field'] == $balanceType) {
                $result = $v;
                break;
            }
        }
        if (! $result) {
            abort('余额类型错误');
        }
        return $result;
    }
}