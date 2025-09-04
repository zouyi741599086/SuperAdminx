<?php
namespace plugin\user\app\common\logic;

use plugin\user\app\common\model\UserTotalMonthModel;
use support\think\Db;

/**
 * 用户月统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalMonthLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public static function getList(array $params = [], bool $page = true)
    {
        // 排序
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = UserTotalMonthModel::withSearch(['month'], $params)
            //->withoutField('')
            //->with([])
            ->order($orderBy);

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 增加
     * @param string $month 月份
     * @return void
     */
    public static function incCount(?string $month = null) : void
    {
        $dbPrefix = getenv('DB_PREFIX');
        $month    = $month ?: date('Y-m');

        // 有数据在更新，没得则新增
        Db::execute(
            "INSERT INTO {$dbPrefix}user_total_month (month, count) VALUES (?,1) ON DUPLICATE KEY UPDATE count = count + 1",
            [$month]
        );
    }

    /**
     * 统计
     */
    public static function getTotal()
    {
        return array_reverse(UserTotalMonthModel::order('id desc')
            ->limit(12)
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
                    $v->month ?? '',
                    $v->count ?? '',
                ];
            }
        } catch (\Exception $e) {
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