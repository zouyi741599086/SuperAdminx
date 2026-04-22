<?php
namespace plugin\admin\app\common\logic\adminTodo;

use plugin\admin\app\common\model\AdminTodoModel;
use think\facade\Db;

/**
 * 待办事项 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminTodoExecuteLogic
{

    /**
     * 新增
     * @param array $params
     * @param int $adminUserId
     */
    public function create(array $params, int $adminUserId)
    {
        Db::startTrans();
        try {
            $data = [];
            foreach ($params['list'] as $v) {
                if (isset($v['date']) && $v['date'] && isset($v['content']) && $v['content']) {
                    $data[] = [
                        'admin_user_id' => $adminUserId,
                        'date'          => $v['date'],
                        'content'       => $v['content'],
                    ];
                }
            }
            $data && (new AdminTodoModel())->saveAll($data);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 更新
     * @param array $params
     */
    public function update(array $params)
    {
        Db::startTrans();
        try {
            AdminTodoModel::update($params);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 更新状态
     * @param int|array $id
     * @param int $status
     */
    public function updateStatus(int|array $id, int $status)
    {
        Db::startTrans();
        try {
            AdminTodoModel::where('id', 'in', $id)->update([
                'status'        => $status,
                'complete_time' => date('Y-m-d H:i:s'),
            ]);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 删除
     * @param int|array $id 要删除的id
     */
    public function delete(int|array $id)
    {
        AdminTodoModel::destroy($id);
    }
}