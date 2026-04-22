<?php
namespace plugin\payRecord\app\common\logic\payRecord;

use plugin\payRecord\app\common\model\PayRecordModel;
use app\utils\PayUtils;
use think\facade\Db;

/**
 * 支付记录
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecordExecuteLogic
{

    /**
     * 新增
     * @param array $parmas
     */
    public function create(array $parmas)
    {
        Db::startTrans();
        try {
            PayRecordModel::create($parmas);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 支付记录里面执行退款
     * @param int $id
     * @param float $money
     * @param string $reason
     */
    public function refundMoney(int $id, float $money, string $reason)
    {
        $data = PayRecordModel::find($id);

        if ($data->refund_money < $money) {
            abort('失败：退款金额大于可退金额');
        }

        Db::startTrans();
        try {
            // 执行退款
            switch ($data->pay_type) {
                case 'money':
                    balance_change(
                        $data->user_id,
                        $money,
                        'money',
                        'money_refund',
                        $reason,
                    );
                    break;
                case 'wechat':
                    (new PayUtils())->wechatRefund($data->orderno, $money, $data->total);
                    break;
                case 'alipay':
                    (new PayUtils())->alipayRefund($data->orderno, $money, $data->pay_source);
                    break;
            }

            $data->refund_money -= $money;
            $data->save();

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}