<?php
namespace plugin\user\app\common\logic\userTotalDay;

use plugin\user\app\common\logic\userTotalDay\DayQueryLogic;

/**
 * 用户日统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DayExportLogic
{

    public function __construct(
        private DayQueryLogic $dayQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        try {
            $list    = $this->dayQueryLogic->getList($params, false)->cursor();
            $tmpList = [];
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v->date ?? '',
                    $v->count ?? '',
                ];
            }
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
        // 表格头
        $header = ['日期', '注册人数'];
        return [
            'filePath' => export($header, $tmpList),
            'fileName' => "用户日统计.xlsx",
        ];
    }

}