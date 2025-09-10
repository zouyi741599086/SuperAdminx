<?php
namespace plugin\user\app\common\logic;

use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\validate\UserValidate;
use app\utils\JwtUtils;
use support\think\Db;
use Webman\Event\Event;

/**
 * 用户 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserLogic
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

        $list = UserModel::withSearch(['name', 'tel', 'status', 'pid', 'create_time'], $params, true)
            ->withoutField('password')
            ->with(['PUser' => function ($query)
            {
                $query->field('id,img,name,tel');
            }])
            ->order($orderBy);

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 新增用户
     * @param array $params 
     */
    public static function create(array $params)
    {
        try {
            think_validate(UserValidate::class)->scene('create')->check($params);
            $result = UserModel::create($params);

            // 跟新上级路劲
            self::updatePidPath($result->id);
            // 用户事件
            Event::emit('user.create', $result->id);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取数据
     * @param int $id 数据id
     */
    public static function findData(int $id)
    {
        return UserModel::find($id)->hidden(['password']);
    }

    /**
     * 更新
     * @param array $params
     */
    public static function update(array $params)
    {
        Db::startTrans();
        try {
            think_validate(UserValidate::class)->scene('create')->check($params);

            // 如果前端没传上级，则更新为null
            if (! isset($params['pid'])) {
                $params['pid'] = null;
            }
            // 如果有上级，则上级不能是自己，也不能是自己下面的人
            if (isset($params['pid']) && $params['pid']) {
                if ($params['pid'] == $params['id']) {
                    abort('上级不能选择自己');
                }
                if (
                    UserModel::where('pid_path', 'like', "%,{$params['id']},%")
                        ->where('id', '<>', $params['id'])
                        ->where('id', $params['pid'])
                        ->value('id')
                ) {
                    abort('上级不能选择自己下面的用户');
                }
            }

            UserModel::update($params);
            // 跟新上级路劲
            self::updatePidPath($params['id']);

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 添加修改共用，维护数据的pid_path字段
     * @param int $id
     */
    private static function updatePidPath(int $id)
    {
        $oldUser = UserModel::field('id,pid,pid_path,pid_layer')->find($id);

        // 只更新我自己，本来这块程序如果把条件去掉则可以更新自己及自己下面所有的用户，但是如果我下面所有用户量太大则导致程序卡死，所以只能分开更新自己，在更新自己下面的人
        UserModel::where('id', $id)
            //->where('pid_path', 'like', "%,{$id},%") // 去掉上面个条件，放开这个则会更新所有，适合数据量小的情况
            ->order("pid_layer asc")
            ->field('id,pid,pid_path,pid_layer')
            ->select()
            ->each(function ($item)
            {
                if ($item['pid']) {
                    $pidUser         = UserModel::field('id,pid,pid_path,pid_layer')->find($item['pid']);
                    $item->pid_path  = "{$pidUser->pid_path}{$item->id},";
                    $item->pid_layer = $pidUser->pid_layer + 1;
                } else {
                    $item->pid_path  = ",{$item->id},";
                    $item->pid_layer = 1;
                }
                $item->save();
            });
        if (! $oldUser->pid_path) {
            return;
        }

        $newUser = UserModel::field('id,pid,pid_path,pid_layer')->find($id);

        // 开始更新我下面的用户
        UserModel::where('pid_path', 'like', "%{$oldUser->pid_path}%")
            ->where('id', '<>', $id)
            ->order("pid_layer asc")
            ->field('id,pid,pid_path,pid_layer')
            ->chunk(1000, function ($list) use ($oldUser, $newUser)
            {
                // 构建 CASE WHEN 语句实现批量更新
                $casePath  = "CASE id ";
                $caseLayer = "CASE id ";
                $ids       = [];

                foreach ($list as $k => $v) {
                    $id    = (int) $v['id'];
                    $path  = str_replace($oldUser->pid_path, $newUser->pid_path, $v['pid_path']);
                    $layer = (int) $v['pid_layer'] + ($newUser->pid_layer - $oldUser->pid_layer);

                    $casePath .= "WHEN {$id} THEN '{$path}' ";
                    $caseLayer .= "WHEN {$id} THEN {$layer} ";
                    $ids[]     = $id;
                }

                $casePath .= "END";
                $caseLayer .= "END";
                $idsStr    = implode(',', $ids);

                // 构建原生SQL
                $sql = "UPDATE sa_user 
                SET pid_path = {$casePath},
                    pid_layer = {$caseLayer}
                WHERE id IN ({$idsStr})";

                // 执行更新
                Db::execute($sql);
            });
    }

    /**
     * 用户状态修改
     * @param int|array $id
     * @param int $status
     */
    public static function updateStatus(int|array $id, int $status)
    {
        try {
            UserModel::where('id', 'in', $id)->update([
                'status' => $status
            ]);

            $id = is_array($id) ? $id : [$id];
            foreach ($id as $v) {
                JwtUtils::logoutUser('user', $v);
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改自己的登录密码
     * @param array $data
     * @param int $userId 当前登录用户的id
     */
    public static function updatePassword(array $data, int $userId)
    {
        try {
            think_validate(UserValidate::class)->scene('update_password')->check($data);

            // 判断原密码是否正确
            $oldPassword = UserModel::where('id', $userId)->value('password');
            if (! password_verify($data['password'], $oldPassword)) {
                abort('原密码错误');
            }
            // 判断两次密码输入是否一致
            if ($data['new_password'] != $data['confirm_password']) {
                abort('新密码两次输入不一致');
            }
            UserModel::update([
                'id'       => $userId,
                'password' => $data['new_password']
            ]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 搜索选择某条数据
     * @param array $params
     */
    public static function selectUser(array $params)
    {
        return UserModel::field('id,name,tel')
            ->when(isset($params['keywords']) && $params['keywords'], function ($query) use ($params)
            {
                $query->where('id|name|tel', 'like', "%{$params['keywords']}%");
            })
            ->when(isset($params['id']) && $params['id'], function ($query) use ($params)
            {
                $query->where('id', $params['id']);
            })
            ->order('id desc')
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 查询推广关系
     * @param array $params 
     */
    public static function invitations(array $params)
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
     * 用户修改自己的资料
     * @method post
     * @param array $params
     * @param int $userId
     * @return void
     */
    public static function updateInfo(array $params, int $userId) : void
    {
        if (! isset($params['action']) && ! $params['action']) {
            abort('参数错误');
        }

        try {
            // 修改头像
            if ($params['action'] == 'img') {
                if (! isset($params['img']) || ! $params['img']) {
                    abort('参数错误');
                }
                UserModel::update([
                    'id'  => $userId,
                    'img' => $params['img']
                ]);
            }

            // 修改昵称
            if ($params['action'] == 'name') {
                if (! isset($params['name']) || ! $params['name']) {
                    abort('参数错误');
                }
                if (mb_strlen($params['name'], 'UTF-8') > 12) {
                    abort('昵称长度不能超过12个字符');
                }
                UserModel::where('id', $userId)
                    ->update(['name' => $params['name']]);
            }

            // 修改手机号
            if ($params['action'] == 'tel') {
                if (! isset($params['tel']) || ! $params['tel']) {
                    abort('参数错误');
                }
                if (
                    UserModel::where('tel', $params['tel'])
                        ->where('id', '<>', $userId)
                        ->value('id')
                ) {
                    abort('手机号已存在');
                }
                UserModel::where('id', $userId)
                    ->update(['tel' => $params['tel']]);
            }

            // 修改性别
            if ($params['action'] == 'sex') {
                if (! isset($params['sex']) || ! $params['sex']) {
                    abort('参数错误');
                }
                UserModel::where('id', $userId)
                    ->update(['sex' => $params['sex']]);
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }

    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public static function exportData(array $params)
    {
        try {
            $list    = self::getList($params, false)->cursor();
            $tmpList = [];
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v->name ?? '',
                    $v->tel ?? '',
                    $v->status == 1 ? '正常' : '禁用',
                    $v->pid ? "{$v->PUser->name}/{$v->PUser->tel}" : '--',
                    $v->create_time ?? '',
                ];
            }

            // 表格头
            $header = ['姓名', '手机号', '状态', '上级用户', '注册时间'];
            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "用户.xlsx"
            ];
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 查用户的上级路劲
     * @param int $id 用户id
     * @return array
     */
    public static function selectPidPathUser(int $id) : array
    {
        $pidPath = UserModel::where('id', $id)->value('pid_path');
        // 处理上级路径
        $pidPath = array_filter(explode(',', $pidPath));

        // 获取所有符合条件的上级渠道商
        $list = UserModel::whereIn('id', $pidPath)
            ->field('id,pid,name,img,tel')
            ->select()
            ->toArray();
        // 上级所有用户读出来后，按照真实的上级顺序进行排序
        usort($list, fn ($a, $b) =>
            array_search($a['id'], $pidPath) - array_search($b['id'], $pidPath)
        );
        return $list;
    }

}