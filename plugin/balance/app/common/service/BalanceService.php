<?php
namespace plugin\balance\app\common\service;

use plugin\balance\app\common\logic\balance\{BalanceQueryLogic, BalanceExportLogic, BalanceTurnLogic, BalanceUpdateLogic};

/**
 * 用户余额
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceService
{

    public function __construct(
        private BalanceQueryLogic $balanceQueryLogic,
        private BalanceExportLogic $balanceExportLogic,
        private BalanceTurnLogic $balanceTurnLogic,
        private BalanceUpdateLogic $balanceUpdateLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        return $this->balanceQueryLogic->getList($params, $with, $page);
    }

    /**
     * 变更用户余额
     * @param array $params
     */
    public function updateBalance(array $params)
    {
        $this->balanceUpdateLogic->updateBalance($params);
    }

    /**
     * 账户转账
     * @param array $params
     */
    public function turn(array $params)
    {
        $this->balanceTurnLogic->turn($params);
    }

    /**
     * 查找余额类型
     * @param string $balanceType
     * @return mixed
     */
    public function findBalanceType(string $balanceType)
    {
        $balanceTypeList = config('plugin.balance.superadminx.balance_type');
        $tmp             = null;
        foreach ($balanceTypeList as $v) {
            if ($v['field'] == $balanceType) {
                $tmp = $v;
                break;
            }
        }
        if (! $tmp) {
            abort('余额类型错误');
        }
        return $tmp;
    }

    /**
     * 获取用户的余额
     * @param int $userId
     * @return mixed
     */
    public function getUserBalance(int $userId)
    {
        return $this->balanceQueryLogic->getUserBalance($userId);
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public function exportData(array $params)
    {
        return $this->balanceExportLogic->exportData($params);
    }

    /**
     * 统计余额
     * @return array
     */
    public function getTotal() : array
    {
        return $this->balanceQueryLogic->getTotal();
    }

}