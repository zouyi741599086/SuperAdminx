<?php
namespace plugin\balance\app\common\logic\balanceWithdraw;

use plugin\balance\app\common\model\BalanceWithdrawModel;
use support\think\Db;

/**
 * 后台状态修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WithdrawUpdateStaticLogic
{
    /**
     * 更新状态
     * @param int|array $id
     * @param int $status
     * @param string $reason
     */
    public function updateStatus(int|array $id, int $status, string $reason = '')
    {
        Db::startTrans();
        try {
            $this->handleStatusUpdate($id, $status, $reason);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e);
        }
    }

    /**
     * 处理状态更新
     * @param int|array $id
     * @param int $status
     * @param string $reason
     */
    protected function handleStatusUpdate(int|array $id, int $status, string $reason = '')
    {
        switch ($status) {
            case 4: // 审核通过
                $this->approveWithdraw($id);
                break;
            case 6: // 审核拒绝
                $this->rejectWithdraw($id, $reason);
                break;
            case 7: // 已打款
                $this->markAsPaid($id);
                break;
            case 8: // 打款成功
                $this->confirmPaymentSuccess($id);
                break;
            case 10: // 打款失败
                $this->handlePaymentFailure($id, $reason);
                break;
            default:
                // 可以抛出异常或记录日志
                throw new \Exception('未知操作');
                break;
        }
    }

    /**
     * 审核通过提现申请
     * @param int|array $id
     */
    protected function approveWithdraw(int|array $id)
    {
        BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', 2)
            ->update([
                'status'     => 4,
                'audit_time' => date('Y-m-d H:i:s'),
            ]);
    }

    /**
     * 审核拒绝提现申请
     * @param int|array $id
     * @param string $reason
     */
    protected function rejectWithdraw(int|array $id, string $reason)
    {
        $ids = BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', 2)
            ->column('id');

        if (empty($ids)) {
            return;
        }

        // 更改状态
        BalanceWithdrawModel::where('id', 'in', $ids)
            ->update([
                'status'     => 6,
                'audit_time' => date('Y-m-d H:i:s'),
                'reason'     => $reason,
            ]);

        // 给用户把钱加回去
        $this->refundToUsers($ids, "提现审核拒绝");
    }

    /**
     * 标记为已打款
     * @param int|array $id
     */
    protected function markAsPaid(int|array $id)
    {
        BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', 4)
            ->update([
                'status'   => 7,
                'pay_time' => date('Y-m-d H:i:s'),
            ]);
    }

    /**
     * 确认打款成功
     * @param int|array $id
     */
    protected function confirmPaymentSuccess(int|array $id)
    {
        BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', 4)
            ->update([
                'status'   => 8,
                'pay_time' => date('Y-m-d H:i:s'),
            ]);
    }

    /**
     * 处理打款失败
     * @param int|array $id
     * @param string $reason
     */
    protected function handlePaymentFailure(int|array $id, string $reason)
    {
        $ids = BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', 4)
            ->column('id');

        if (empty($ids)) {
            return;
        }

        // 更改状态
        BalanceWithdrawModel::where('id', 'in', $ids)
            ->update([
                'status'   => 10,
                'pay_time' => date('Y-m-d H:i:s'),
                'reason'   => $reason,
            ]);

        // 给用户把钱加回去
        $this->refundToUsers($ids, "提现打款失败");
    }

    /**
     * 退款给用户
     * @param array $ids 提现记录ID数组
     * @param string $reasonPrefix 退款原因前缀
     */
    protected function refundToUsers(array $ids, string $reasonPrefix)
    {
        foreach ($ids as $id) {
            $data = BalanceWithdrawModel::where('id', $id)->find();
            if (!$data) {
                continue;
            }

            // 给用户加钱
            balance_change(
                $data['user_id'],
                $data['money'],
                $data['balance_type'],
                'money_balance_withdraw',
                "{$reasonPrefix}[{$data['orderno']}]",
            );
        }
    }

    /**
     * 获取有效的提现记录ID
     * @param int|array $id
     * @param int $fromStatus 原始状态
     * @return array
     */
    protected function getValidRecordIds(int|array $id, int $fromStatus): array
    {
        return BalanceWithdrawModel::where('id', 'in', $id)
            ->where('status', $fromStatus)
            ->column('id');
    }

    /**
     * 更新提现记录状态
     * @param array $ids
     * @param int $toStatus 目标状态
     * @param array $extraData 额外更新字段
     */
    protected function updateWithdrawStatus(array $ids, int $toStatus, array $extraData = [])
    {
        $updateData = array_merge(['status' => $toStatus], $extraData);
        
        BalanceWithdrawModel::where('id', 'in', $ids)
            ->update($updateData);
    }
}