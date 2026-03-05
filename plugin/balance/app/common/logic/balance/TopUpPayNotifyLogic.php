<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\shop\app\common\model\PayRecordModel;
use support\Log;
use app\utils\PayUtils;

/**
 * 充值支付
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class TopUpPayNotifyLogic
{

    /**
     * 微信支付回调
     */
    public function wechatNotify()
    {
        try {
            // 微信支付回调
            $result = (new PayUtils())->wechatNotify();
            parse_str($result['attach'], $params);

            //插入支付记录表
            $success_time = rtrim($result['success_time'], '+08:00');
            PayRecordModel::create([
                'type'         => 1,
                'user_id'      => $params['user_id'],
                'pay_type'     => $params['pay_type'],
                'pay_source'   => $params['pay_source'],
                'out_trade_no' => $result['out_trade_no'], // 我方单号
                'orderno'      => $result['transaction_id'], // 微信单号
                'total'        => $result['amount']['total'] / 100, // 订单总金额
                'payer_total'  => $result['amount']['payer_total'] / 100, // 用户实付金额
                'refund_money' => $result['amount']['payer_total'] / 100, // 可退款金额
                'success_time' => str_replace("T", " ", $success_time),
                'content'      => $result,
            ]);

            // 充值
            $this->topUp($params['user_id'], $params['money']);

            return (new PayUtils())->wechatNotifySuccess();
        } catch (\Throwable $e) {
            Log::error("微信支付回调错误，{$e->getMessage()}", request()->post());
            abort($e->getMessage());
        }
    }

    /**
     * 支付宝支付回调
     */
    public function aliNotify()
    {
        try {
            $result = (new PayUtils())->aliNotify();
            parse_str(urldecode($result['passback_params']), $params);

            //插入支付记录表
            PayRecordModel::create([
                'type'         => 1,
                'user_id'      => $params['user_id'],
                'pay_type'     => $params['pay_type'],
                'pay_source'   => $params['pay_source'],
                'out_trade_no' => $result['out_trade_no'], // 我方单号
                'orderno'      => $result['trade_no'], // 支付宝单号
                'total'        => $result['receipt_amount'], // 订单总金额
                'payer_total'  => $result['buyer_pay_amount'], // 用户实付金额
                'refund_money' => $result['buyer_pay_amount'],  // 可退款金额
                'success_time' => $result['gmt_payment'],
                'content'      => $result,
            ]);

            // 充值
            $this->topUp($params['user_id'], $params['money']);

        } catch (\Throwable $e) {
            Log::error("支付宝回调错误，{$e->getMessage()}", request()->post());
            abort($e->getMessage());
        }
    }

    /**
     * 充值
     * @param int $userId 用户ID
     * @param float $money 金额
     */
    private function topUp(int $userId, float $money)
    {
        balance_change(
            $userId,
            $money,
            'money',
            'money_top_up',
            '余额充值',
        );
    }
}