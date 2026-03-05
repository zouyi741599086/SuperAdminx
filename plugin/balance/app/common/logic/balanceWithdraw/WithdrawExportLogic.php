<?php
namespace plugin\balance\app\common\logic\balanceWithdraw;

use plugin\balance\app\common\logic\balanceWithdraw\WithdrawQueryLogic;

/**
 * 导出余额提现
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WithdrawExportLogic
{

    public function __construct(
        private WithdrawQueryLogic $withdrawQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public function exportData(array $params)
    {
        try {
            $with    = ['User' => function ($query)
            {
                $query->field('id,name,tel,img');
            }];
            $list    = $this->withdrawQueryLogic->getList($params, $with, false)->cursor();
            $tmpList = [];
            foreach ($list as $v) {

                $status = match ($v->status) {
                    2       => '待审核',
                    4       => '审核通过待打款',
                    6       => '审核拒绝',
                    7       => '打款中',
                    8       => '打款成功',
                    10      => '打款失败',
                    default => '--'
                };

                // 导出的数据
                $tmpList[] = [
                    $v->User->name ?? '--',
                    $v->User->tel ?? '--',
                    $v->orderno ?? '',
                    $status ?? '',
                    $v->money ?? '',
                    $v->shouxufei ?? '',
                    $v->on_money ?? '',
                    $v->bank_name ?? '',
                    $v->bank_title ?? '',
                    $v->bank_number ?? '',
                    $v->create_time ?? '',
                    $v->audit_time ?? '',
                    $v->pay_time ?? '',
                    $v->reason ?? '',
                ];
            }

            // 表格头
            $header = ['用户昵称', '用户手机号', '单号', '状态', '提现金额', '手续费', '到账金额', '姓名', '银行', '银行卡号', '申请时间', '审核时间', '打款时间', '失败原因'];
            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "余额提现.xlsx",
            ];
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

}