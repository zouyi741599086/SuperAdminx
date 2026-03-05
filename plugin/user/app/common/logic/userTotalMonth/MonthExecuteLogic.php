<?php
namespace plugin\user\app\common\logic\userTotalMonth;

use support\think\Db;

/**
 * 用户月统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MonthExecuteLogic
{


    /**
     * 增加
     * @param string $month 月份
     * @return void
     */
    public function incCount(?string $month = null) : void
    {
        $dbPrefix = getenv('DB_PREFIX');
        $month    = $month ?: date('Y-m');

        // 有数据在更新，没得则新增
        Db::execute(
            "INSERT INTO {$dbPrefix}user_total_month (month, count) VALUES (?,1) ON DUPLICATE KEY UPDATE count = count + 1",
            [$month],
        );
    }

}