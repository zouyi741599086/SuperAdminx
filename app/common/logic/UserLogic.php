<?php
namespace app\common\logic;

use app\common\model\UserModel;
use app\common\validate\UserValidate;
use app\utils\Sms;
use think\facade\Db;

/**
 * 用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserLogic
{

    /**
     * 获取列表
     * @param array $params
     * @param bool $page 是否需要翻页
     */
    public static function getList(array $params, bool $page = true)
    {
        $list = UserModel::withSearch(['name', 'tel', 'status', 'create_time'], $params)
            ->order('id desc');

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list->select();
    }

    /**
     * 搜索选择用户
     * @param string $keywords 
     * @param int $user_id
     */
    public static function selectUser(string $keywords = null, int $user_id = null)
    {
        $where = [];
        //搜索
        $keywords != null && $where[] = ['name|tel', 'like', "%{$keywords}%"];
        $user_id != null && $where[] = ['id', '=', $user_id];

        return UserModel::field('id,name,tel')
            ->where($where)
            ->order('id desc')
            ->limit(20)
            ->select();
    }

    /**
     * 添加
     * @param array $params
     */
    public static function create(array $params)
    {
        try {
            validate(UserValidate::class)->scene('create')->check($params);

            UserModel::create($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改
     * @param array $params
     */
    public static function udpate(array $params)
    {
        try {
            validate(UserValidate::class)->scene('update')->check($params);
            //不修改密码的时候干掉此字段
            if (isset($params['password']) && ! $params['password']) {
                unset($params['password']);
            }
            UserModel::update($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        return UserModel::find($id);
    }

    /**
     * 删除
     * @param int $id
     */
    public static function delete(int $id) : void
    {
        UserModel::destroy($id);
    }

    /**
     * 锁定状态修改
     * @param int $id
     * @param int $status
     */
    public static function updateStatus(int $id, int $status)
    {
        UserModel::update([
            'id'     => $id,
            'status' => $status
        ]);
    }

    /**
     * 修改自己的登录密码
     * @param array $params
     * @param int $login_user_id 当前登录用户的id
     */
    public static function updatePassword(array $params, int $id)
    {
        try {
            validate(UserValidate::class)->scene('updatePassword')->check($params);

            //判断原密码是否正确
            $password = UserModel::where('id', $id)->value('password');
            if (! password_verify($params['password'], $password)) {
                abort('原密码错误');
            }
            UserModel::update([
                'id'       => $id,
                'password' => $params['new_password']
            ]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改自己的资料
     * @param array $params
     * @param int $login_user_id 要修改的id，就是当前登录用户的id
     */
    public static function updateInfo(array $params, int $login_user_id)
    {
        try {
            $params['id'] = $login_user_id;
            validate(UserValidate::class)->scene('updateInfo')->check($params);

            UserModel::update($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * @log 重设密码
     * @param array $params
     */
    public static function resetPassword(array $params)
    {
        if (
            ! isset($params['tel']) ||
            ! $params['tel'] ||
            ! isset($params['code']) ||
            ! $params['code'] ||
            ! isset($params['new_password']) ||
            ! $params['new_password']
        ) {
            abort('参数错误');
        }

        Db::startTrans();
        try {
            //核销验证码
            Sms::checkCode($params['tel'], 1, $params['code']);

            //判断此律师是否存在 是否正常
            $user = UserModel::where('tel', $params['tel'])->find();
            if (! $user || $user['status'] == 2) {
                abort('手机号错误~');
            }

            //开始修改
            UserModel::update([
                'id'       => $user['id'],
                'password' => $params['new_password'],
            ]);
            // 提交事务
            Db::commit();
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
            abort($e->getMessage());
        }
    }

}