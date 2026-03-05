<?php
namespace plugin\admin\app\common\logic\adminRole;

use plugin\admin\app\common\model\AdminRoleModel;
use think\facade\Db;

/**
 * 后台用户角色
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminRoleQueryLogic
{
    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return AdminRoleModel::withSearch(
            ['title'],
            $params,
            true,
        )
            ->order('id desc')
            ->where('id', '<>', 1)
            ->withCount([
                'AdminUser',
                'AdminRoleMenu',
                'AdminMenu',
            ])->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return AdminRoleModel::find($id);
    }

    /**
     * 搜索选择某条数据
     * @param array $params 
     */
    public function selectAdminRole(array $params)
    {
        $params['pageSize'] = $params['pageSize'] ?? 20;
        return AdminRoleModel::field('id,title')
            ->where('id', '<>', 1)
            ->when(isset($params['keywords']) && $params['keywords'], function ($query) use ($params)
            {
                $query->where('title', 'like', "%{$params['keywords']}%");
            })
            ->when(true, function ($query) use (&$params)
            {
                $orderBy = 'id DESC';
                $query->orderRaw(get_select_order_by($orderBy, $params));
            })
            ->paginate($params['pageSize']);
    }

    /**
     * 获取某个角色的连接权限
     * @param int $id
     */
    public function getDataMenu(int $id)
    {
        return AdminRoleModel::with(['AdminRoleMenu'])->find($id);
    }

}