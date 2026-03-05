<?php
namespace plugin\user\app\common\logic\userTotalMonth;

use plugin\user\app\common\logic\userTotalMonth\MonthQueryLogic;

/**
 * 用户月统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MonthExportLogic
{
    public function __construct(
        private MonthQueryLogic $monthQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        try {
            $list    = $this->monthQueryLogic->getList($params, false)->cursor();
            $tmpList = [];
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v->month ?? '',
                    $v->count ?? '',
                ];
            }
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
        // 表格头
        $header = ['月份', '注册人数'];
        return [
            'filePath' => export($header, $tmpList),
            'fileName' => "用户月统计.xlsx",
        ];
    }
}