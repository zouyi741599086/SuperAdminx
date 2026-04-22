<?php
namespace plugin\payRecord\app\common\service;

use plugin\payRecord\app\common\logic\payRecord\{PayRecordQueryLogic, PayRecordExportLogic, PayRecordExecuteLogic};

/**
 * 支付记录
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class PayRecordService
{

    public function __construct(
        private PayRecordQueryLogic $payRecordQueryLogic,
        private PayRecordExportLogic $payRecordExportLogic,
        private PayRecordExecuteLogic $payRecordExecuteLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        return $this->payRecordQueryLogic->getList($params, $with, $page);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return $this->payRecordQueryLogic->findData($id);
    }

    /**
     * 支付记录里面执行退款
     * @param int $id
     * @param float $money
     * @param string $reason
     */
    public function refundMoney(int $id, float $money, string $reason)
    {
        $this->payRecordExecuteLogic->refundMoney($id, $money, $reason);
    }

    /**
     * 导出数据
     * @param array $params
     */
    public function exportData(array $params)
    {
        return $this->payRecordExportLogic->exportData($params);
    }

}