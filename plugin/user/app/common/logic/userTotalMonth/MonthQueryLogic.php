<?php
namespace plugin\user\app\common\logic\userTotalMonth;

use plugin\user\app\common\model\UserTotalMonthModel;
use support\think\Db;

/**
 * 用户月统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MonthQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        $list = UserTotalMonthModel::withSearch(
            ['month'],
            $params,
            true,
        )
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "id desc";
                $query->order(get_admin_order_by($orderBy, $params));
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

     /**
     * 统计
     */
    public function getTotal()
    {
        return array_reverse(UserTotalMonthModel::order('id desc')
            ->limit(12)
            ->select()
            ->toArray());
    }
}