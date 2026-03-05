<?php
namespace plugin\balance\app\common\logic\balanceWithdraw;

use plugin\balance\app\common\model\BalanceWithdrawModel;
use support\think\Db;

/**
 * 余额提现 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WithdrawQueryLogic
{
    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        $list = BalanceWithdrawModel::withSearch(
            ['user_id', 'orderno', 'status', 'bank_name', 'bank_title', 'bank_number', 'create_time', 'audit_time', 'reason'],
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
     * 获取数据
     * @param int $id 数据id
     * @param array $with 关联模型
     */
    public function findData(int $id, array $with = ['User'])
    {
        return BalanceWithdrawModel::with($with)->find($id);
    }

    /**
     * 获取最后一次提现的详情
     * @param int $userId 用户id
     */
    public function getLastInfo(int $userId)
    {
        return BalanceWithdrawModel::where('user_id', $userId)
            ->where('status', 8)
            ->order('id', 'desc')
            ->find();
    }

}