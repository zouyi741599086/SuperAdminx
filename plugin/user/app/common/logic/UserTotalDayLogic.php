<?php
namespace plugin\user\app\common\logic;

use plugin\user\app\common\model\UserTotalDayModel;
use plugin\user\app\common\logic\UserTotalMonthLogic;
use support\think\Db;

/**
 * 用户日统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalDayLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public static function getList(array $params = [], bool $page = true, )
    {
        // 排序
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = UserTotalDayModel::withSearch(['date'], $params, true)
            //->withoutField('')
            //->with([])
            ->order($orderBy);

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 增加
     * @param string $date 日期
     * @return void
     */
    public static function incCount(?string $date = null) : void
    {
        $dbPrefix = getenv('DB_PREFIX');
        $date     = $date ?: date('Y-m-d');

        // 有数据在更新，没得则新增
        Db::execute(
            "INSERT INTO {$dbPrefix}user_total_day (date, count) VALUES (?,1) ON DUPLICATE KEY UPDATE count = count + 1",
            [$date]
        );
        UserTotalMonthLogic::incCount();
    }

    /**
     * 统计
     */
    public static function getTotal()
    {
        return array_reverse(UserTotalDayModel::order('id desc')
            ->limit(365)
            ->select()
            ->toArray());
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public static function exportData(array $params) : array
    {
        try {
            $list    = self::getList($params, false)->cursor();
            $tmpList = [];
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v->date ?? '',
                    $v->count ?? '',
                ];
            }
        } catch (\Exception $e) {
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