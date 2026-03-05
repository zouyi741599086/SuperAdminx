<?php
namespace plugin\user\app\common\logic\userTotalDay;

use plugin\user\app\common\logic\userTotalMonth\MonthExecuteLogic;
use support\think\Db;

/**
 * 用户日统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DayExecuteLogic
{
    public function __construct(
        private MonthExecuteLogic $monthExecuteLogic,
    ) {}

    /**
     * 增加
     * @param string $date 日期
     * @return void
     */
    public function incCount(?string $date = null) : void
    {
        $dbPrefix = getenv('DB_PREFIX');
        $date     = $date ?: date('Y-m-d');

        // 有数据在更新，没得则新增
        Db::execute(
            "INSERT INTO {$dbPrefix}user_total_day (date, count) VALUES (?,1) ON DUPLICATE KEY UPDATE count = count + 1",
            [$date],
        );
        $this->monthExecuteLogic->incCount();
    }
}