<?php
namespace plugin\admin\app\common\logic\adminUserTodo;

use plugin\admin\app\common\model\AdminUserTodoModel;

/**
 * 待办事项 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserTodoQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联
     * @param array $withCount 关联统计
     * @param bool $page 是否分页
     * */
    public function getList(array $params = [], array $with = [], array $withCount = [], bool $page = true)
    {
        $list = AdminUserTodoModel::withSearch(
            ['admin_user_id', 'date', 'status'],
            $params,
            true,
        )
            //->withoutField([])
            ->with($with)
            ->with($withCount)
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "date asc";
                $orderBy = get_admin_order_by($orderBy, $params);
                $query->order($orderBy);
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 获取某月待办事项数量
     * @method get
     * @param string $startDate 开始时间
     * @param string $endDate 结束时间
     * @return array
     * -- 日期
     *  -- todo 待办事项数量
     *  -- done 已完成事项数量
     */
    public function getMonthCount(int $adminUserId, ?string $startDate = null, ?string $endDate = null) : array
    {
        $startDate = $startDate ?: date('Y-m-01');
        $endDate   = $endDate ?: date('Y-m-t');
        $startDate = date('Y-m-d', strtotime($startDate . ' -7 days')); // 减7天
        $endDate   = date('Y-m-d', strtotime($endDate . ' +14 days')); // 加14天
        $stats     = AdminUserTodoModel::where('admin_user_id', $adminUserId)
            ->whereBetweenTime('date', $startDate, $endDate)
            ->whereNotNull('date')
            ->fieldRaw("DATE(date) as stat_date")
            ->fieldRaw("COUNT(CASE WHEN status = 1 THEN 1 END) as todo_count")
            ->fieldRaw("COUNT(CASE WHEN status = 2 THEN 1 END) as done_count")
            ->group('stat_date')
            ->select();

        $result = [];
        foreach ($stats as $row) {
            $result[$row['stat_date']] = [
                'todo' => (int) $row['todo_count'],
                'done' => (int) $row['done_count'],
            ];
        }
        return $result;
    }

    /**
     * 获取数据
     * @param int $id 数据id
     * @param array $with 关联数据
     */
    public function findData(int $id, array $with = [])
    {
        return AdminUserTodoModel::with($with)->find($id);
    }
}