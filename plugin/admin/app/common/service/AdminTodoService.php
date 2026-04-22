<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminTodo\{AdminTodoQueryLogic, AdminTodoExecuteLogic};
use think\facade\Db;

/**
 * 待办事项 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminTodoService
{

    public function __construct(
        private AdminTodoQueryLogic $adminTodoQueryLogic,
        private AdminTodoExecuteLogic $adminTodoExecuteLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联
     * @param array $withCount 关联统计
     * @param bool $page 是否分页
     * */
    public function getList(array $params = [], array $with = [], array $withCount = [], bool $page = true)
    {
        return $this->adminTodoQueryLogic->getList($params, $with, $withCount, $page);
    }

    /**
     * 获取某月待办事项数量
     * @method get
     * @param string $startDate 开始时间
     * @param string $endDate 结束时间
     * @return array
     */
    public function getMonthCount(int $adminUserId, ?string $startDate = null, ?string $endDate = null) : array
    {
        return $this->adminTodoQueryLogic->getMonthCount($adminUserId, $startDate, $endDate);
    }


    /**
     * 新增
     * @param array $params
     * @param int $adminUserId
     */
    public function create(array $params, int $adminUserId)
    {
        $this->adminTodoExecuteLogic->create($params, $adminUserId);
    }

    /**
     * 获取数据
     * @param int $id 数据id
     * @param array $with 关联数据
     */
    public function findData(int $id, array $with = [])
    {
        return $this->adminTodoQueryLogic->findData($id, $with);
    }

    /**
     * 更新
     * @param array $params
     */
    public function update(array $params)
    {
        $this->adminTodoExecuteLogic->update($params);
    }

    /**
     * 更新状态
     * @param int|array $id
     * @param int $status
     */
    public function updateStatus(int|array $id, int $status)
    {
        $this->adminTodoExecuteLogic->updateStatus($id, $status);
    }

    /**
     * 删除
     * @param int|array $id 要删除的id
     */
    public function delete(int|array $id)
    {
        $this->adminTodoExecuteLogic->delete($id);
    }
}