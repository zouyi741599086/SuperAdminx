<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\balance\app\common\model\BalanceModel;
use support\think\Db;

/**
 * 用户余额 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        $list = BalanceModel::withSearch(
            ['user_id', 'update_time'],
            $params,
            true,
        )
            ->with($with)
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "id desc";
                $query->order(get_admin_order_by($orderBy, $params));
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 获取用户的余额
     * @param int $userId
     * @return mixed
     */
    public function getUserBalance(int $userId)
    {
        $data = BalanceModel::where('user_id', $userId)
            ->hidden(['create_time', 'update_time'])
            ->find();
        // 不存在则新增用户余额
        if (! $data) {
            BalanceModel::create([
                'user_id' => $userId,
            ]);
            $data = BalanceModel::where('user_id', $userId)
                ->hidden(['create_time', 'update_time'])
                ->find();
        }
        return $data;
    }

    /**
     * 后台统计余额
     * @return array
     */
    public function getTotal() : array
    {
        $balanceTypeList = config('plugin.balance.superadminx.balance_type');
        $sum             = '';
        foreach ($balanceTypeList as $v) {
            $sum .= "SUM({$v['field']}) AS {$v['field']},";
        }
        $sum = rtrim($sum, ',');

        return Db::query("
            SELECT 
                {$sum}
            FROM 
                sa_balance
        ");
    }

}