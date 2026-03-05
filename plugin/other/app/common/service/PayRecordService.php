<?php
namespace plugin\other\app\common\service;

use plugin\other\app\common\logic\payRecord\{PayRecordQueryLogic, PayRecordExportLogic};

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
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        return $this->payRecordQueryLogic->getList($params, $page);
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