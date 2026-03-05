<?php
namespace plugin\admin\app\common\logic\adminLog;

use plugin\admin\app\common\model\AdminLogModel;

/**
 * 操作日志
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLogQueryLogic
{
    /**
     * 获取列表
     * @param array $params
     * @return 
     */
    public function getList(array $params)
    {
        return AdminLogModel::withSearch(
            ['name', 'tel', 'title', 'create_time'],
            $params,
            true,
        )
            ->withoutField(['request_header', 'request_get', 'request_post', 'request_url'])
            ->order('id desc')
            ->paginate($params['pageSize'] ?? 20);
    }
}