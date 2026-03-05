<?php
namespace plugin\user\app\common\service;

use plugin\user\app\common\logic\userTotalMonth\{MonthQueryLogic, MonthExportLogic};

/**
 * 用户月统计
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalMonthService
{

    public function __construct(
        private MonthQueryLogic $monthQueryLogic,
        private MonthExportLogic $monthExportLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        return $this->monthQueryLogic->getList($params, $page);
    }

    /**
     * 统计
     */
    public function getTotal()
    {
        return $this->monthQueryLogic->getTotal();
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        return $this->monthExportLogic->exportData($params);
    }
}