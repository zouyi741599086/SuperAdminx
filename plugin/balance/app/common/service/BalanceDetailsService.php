<?php
namespace plugin\balance\app\common\service;

use plugin\balance\app\common\logic\balanceDetails\{DetailsExportLogic, DetailsQueryLogic, DetailsExecuteLogic};

/**
 * 用户余额明细 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceDetailsService
{

    public function __construct(
        private DetailsExportLogic $detailsExportLogic,
        private DetailsQueryLogic $setailsQueryLogic,
        private DetailsExecuteLogic $detailsExecuteLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        return $this->setailsQueryLogic->getList($params, $with, $page);
    }

    /**
     * 新增
     * @param array $params
     * @return void
     */
    public function create(array $params) : void
    {
        $this->detailsExecuteLogic->create($params);
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        return $this->detailsExportLogic->exportData($params);
    }

}