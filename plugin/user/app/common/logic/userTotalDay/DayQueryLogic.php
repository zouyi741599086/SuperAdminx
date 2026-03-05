<?php
namespace plugin\user\app\common\logic\userTotalDay;

use plugin\user\app\common\model\UserTotalDayModel;

/**
 * 用户日统计 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DayQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true, )
    {
        $list = UserTotalDayModel::withSearch(
            ['date'],
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
        return array_reverse(UserTotalDayModel::order('id desc')
            ->limit(365)
            ->select()
            ->toArray());
    }

}