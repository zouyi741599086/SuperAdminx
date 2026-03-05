<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;
use support\think\Db;

/**
 * 用户树形结构逻辑
 */
class UserTreeLogic
{

    /**
     * 更新上级路径
     * @param int $userId 用户ID
     * @return void
     */
    public function updatePidPath(int $userId) : void
    {
        $oldUser = UserModel::field('id,pid,pid_path,pid_layer')->find($userId);

        // 只更新我自己
        $pUser = UserModel::field('id,pid,pid_path,pid_layer')->find($oldUser->pid);
        if ($pUser) {
            UserModel::update([
                'id'        => $userId,
                'pid_path'  => "{$pUser->pid_path}{$userId},",
                'pid_layer' => $pUser->pid_layer + 1,
            ]);
        } else {
            UserModel::update([
                'id'        => $userId,
                'pid_path'  => ",{$userId},",
                'pid_layer' => 1,
            ]);
        }

        if (! $oldUser->pid_path) {
            return;
        }

        $newUser = UserModel::field('id,pid,pid_path,pid_layer')->find($userId);

        // 开始更新我下面的用户
        UserModel::where('pid_path', 'like', "%{$oldUser->pid_path}%")
            ->where('id', '<>', $userId)
            ->order("pid_layer asc")
            ->field('id,pid,pid_path,pid_layer')
            ->chunk(100, function ($list) use ($oldUser, $newUser)
            {
                $casePath  = "CASE id ";
                $caseLayer = "CASE id ";
                $ids       = [];

                foreach ($list as $k => $v) {
                    $id    = (int) $v['id'];
                    $path  = str_replace($oldUser->pid_path, $newUser->pid_path, $v['pid_path']);
                    $layer = (int) $v['pid_layer'] + ($newUser->pid_layer - $oldUser->pid_layer);

                    $casePath  .= "WHEN {$id} THEN '{$path}' ";
                    $caseLayer .= "WHEN {$id} THEN {$layer} ";
                    $ids[]      = $id;
                }

                $casePath  .= "END";
                $caseLayer .= "END";
                $idsStr     = implode(',', $ids);

                $sql = "UPDATE sa_user SET pid_path = {$casePath}, pid_layer = {$caseLayer} WHERE id IN ({$idsStr})";
                Db::execute($sql);
            });
    }

    /**
     * 后台逐级查下级，就是查用户的推广关系
     * @param array $params 查询参数
     */
    public function invitations(array $params)
    {
        return UserModel::field('id,name,tel,pid')
            ->when(isset($params['id']) && $params['id'], function ($query) use ($params)
            {
                $query->where('id', '=', $params['id']);
            })
            ->when(isset($params['pid']) && $params['pid'], function ($query) use ($params)
            {
                $query->where('pid', '=', $params['pid']);
            })
            ->withCount('NextUser')
            ->order('id desc')
            ->select();
    }

    /**
     * 获取下级搜索的条件
     * @param int $userId 用户id
     * @param array $params 参数
     *  - layer 层级，1》直推，2》间推，以此类推， 空为获取所有下级
     *  - keywords 搜索关键字
     * @return array 条件二维数组
     */
    public function getChildrenWhere(int $userId, array $params = []) : array
    {
        $user    = UserModel::find($userId);
        $where   = [];
        $where[] = ['id', '<>', $user->id];

        $layer = isset($params['layer']) ? intval($params['layer']) : null;
        if ($layer == 1) {
            $where[] = ['pid', '=', $user->id];
        } elseif ($layer > 1) {
            $where[] = ['pid_path', 'like', "%,{$user->id},%"];
            $where[] = ['pid_layer', '=', $user->pid_layer + $layer];
        } else {
            $where[] = ['pid_path', 'like', "%,{$user->id},%"];
        }

        if (isset($params['keywords']) && $params['keywords']) {
            $where[] = ['name|tel', 'like', "%{$params['keywords']}%"];
        }

        return $where;
    }

    /**
     * 获取推广列表
     * @param int $userId 用户id
     * @param array $params 查询参数
     * @return mixed 直推列表 或 间推列表 或 3级推广列表 或 4级推广列表 或 ... 或 团队总列表
     */
    public function getChildrenList(int $userId, array $params = [])
    {
        $where = $this->getChildrenWhere($userId, $params);
        return UserModel::where($where)
            ->field('id,img,name,tel,create_time')
            ->paginate($params['pageSize'] ?? 20)
            ->each(function ($item)
            {
                $item->img = file_url($item->img);
            });
    }

    /**
     * 获取用户的所有的上级
     * @param int $userId 用户id
     * @param bool $isMe 是否包含自己
     * @return array 上级列表，第一个是自己或上级（看$isMe），第二个上上级，第三个.....
     */
    public function getPidUser(int $userId, bool $isMe = false) : array
    {
        $user = UserModel::field('id,pid,pid_path')->find($userId);
        if (! $user->pid || ! $user->pid_path) {
            return [];
        }

        $pidPath = array_reverse(array_filter(explode(',', $user->pid_path)));
        $pidUser = UserModel::whereIn('id', $pidPath)
            ->when(! $isMe, function ($query) use ($user)
            {
                $query->where('id', '<>', $user->id);
            })
            ->field('id,name,tel,img,pid')
            ->select()
            ->toArray();

        usort($pidUser, fn ($a, $b) =>
            array_search($a['id'], $pidPath) - array_search($b['id'], $pidPath)
        );

        return $pidUser;
    }
}