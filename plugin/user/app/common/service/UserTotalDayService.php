<?php
namespace plugin\user\app\common\service;

use plugin\user\app\common\logic\userTotalDay\{DayExportLogic, DayQueryLogic};

/**
 * 用户日统计
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalDayService
{

    public function __construct(
        private DayQueryLogic $dayQueryLogic,
        private DayExportLogic $dayExportLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true, )
    {
        return $this->dayQueryLogic->getList($params, $page);
    }

    /**
     * 统计
     */
    public function getTotal()
    {
        return $this->dayQueryLogic->getTotal();
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        return $this->dayExportLogic->exportData($params);
    }

}