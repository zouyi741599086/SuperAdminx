<?php
namespace plugin\payRecord\app\common\logic\payRecord;

use plugin\payRecord\app\common\logic\payRecord\PayRecordQueryLogic;

/**
 * 导出支付记录
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecordExportLogic
{

    public function __construct(
        private PayRecordQueryLogic $payRecordQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params
     */
    public function exportData(array $params)
    {
        try {
            $tableData = [];
            $with      = [
                'User' => function ($query)
                {
                    $query->field('id,name,tel');
                }
            ];
            $this->payRecordQueryLogic->getList($params, $with, false)
                ->chunk(1000, function ($list) use (&$tableData)
                {
                    foreach ($list as $v) {
                        $type = match ($v->type) {
                            1       => '商城订单支付',
                            2       => '充值',
                            default => '--'
                        };

                        $payType = match ($v->pay_type) {
                            'alipay' => '支付宝',
                            'wechat' => '微信',
                            'money'  => '余额',
                            default  => '--'
                        };

                        $paySource = match ($v->pay_source) {
                            'h5'    => 'H5',
                            'app'   => 'APP',
                            'mp'    => '公众号',
                            'mini'  => '小程序',
                            default => '--'
                        };

                        //导出的数据
                        $tableData[] = [
                            $v->User->name ?? '--',
                            $v->User->tel ?? '--',
                            $type,
                            $payType,
                            $paySource,
                            $v->orderno,
                            $v->total,
                            $v->total - $v->refund_money,
                            $v->success_time,
                        ];
                    }
                });

            //表格头
            $header = ['用户昵称', '用户手机号', '类型', '支付方式', '支付来源', '对方订单号', '支付金额', '已退款金额', '支付时间'];
            return [
                'filePath' => export($header, $tableData),
                'fileName' => "支付记录.xlsx",
            ];
        } catch (\Throwable $e) {
            return abort($e->getMessage());
        }
    }

}