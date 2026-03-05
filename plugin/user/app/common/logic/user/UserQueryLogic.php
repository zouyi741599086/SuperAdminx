<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;

/**
 * 用户选择逻辑
 */
class UserQueryLogic
{
    /**
     * 列表
     * @param array $params 参数
     * @param bool $page 是否分页
     */
    public function getList(array $params = [], bool $page = true)
    {
        $list = UserModel::withSearch(
            ['name', 'tel', 'status', 'pid', 'create_time'],
            $params,
            true,
        )
            ->with(['PUser' => function ($query)
            {
                $query->field('id,img,name,tel');
            }])
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "id desc";
                $orderBy = get_admin_order_by($orderBy, $params);
                $query->order($orderBy);
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 获取数据
     * @param int $id 数据ID
     */
    public function findData(int $id)
    {
        return UserModel::with(['UserInfo'])->find($id);
    }

    /**
     * 后台搜索选择某条数据
     * @param array $params 参数
     */
    public function selectUser(array $params)
    {
        $params['pageSize'] = $params['pageSize'] ?? 20;
        return UserModel::field('id,name,tel')
            ->when(isset($params['keywords']) && $params['keywords'], function ($query) use ($params)
            {
                $query->where('id|name|tel', 'like', "%{$params['keywords']}%");
            })
            ->when(true, function ($query) use (&$params)
            {
                $orderBy = 'id DESC';
                $query->orderRaw(get_select_order_by($orderBy, $params));
            })
            ->paginate($params['pageSize']);
    }

    /**
     * 用户端搜索某个用户，不能搜索自己
     * @param int $userId 用户ID
     * @param string $tel 手机号
     */
    public function searchUser(int $userId, string $tel)
    {
        $user = UserModel::where('tel', $tel)
            ->field('id,img,name,tel')
            ->find();

        if (! $user) {
            abort('用户不存在');
        }
        if ($userId == $user->id) {
            abort('不能搜索自己');
        }

        return $user;
    }
}