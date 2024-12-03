<?php
namespace app\common\logic;

use app\common\model\AdminUserModel;
use app\common\model\AdminMenuModel;
use app\common\model\AdminRoleMenuModel;
use app\common\validate\AdminUserValidate;

/**
 * 后台用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserLogic
{

    /**
     * 获取列表
     * @param array $params
     */
    public static function getList(array $params)
    {
        return AdminUserModel::withSearch(['name', 'tel', 'admin_role_id', 'username', 'status'], $params)
            ->with(['AdminRole'])
            ->order('id desc')
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 添加管理员
     * @param array $params
     */
    public static function create(array $params)
    {
        try {
            validate(AdminUserValidate::class)->scene('create')->check($params);

            AdminUserModel::create($params);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改管理员
     * @param array $params
     */
    public static function udpate(array $params)
    {
        try {
            validate(AdminUserValidate::class)->scene('update')->check($params);

            // 没修改密码则干掉此字段
            if (isset($params['password']) && ! $params['password']) {
                unset($params['password']);
            }
            AdminUserModel::update($params);
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
        return AdminUserModel::find($id);
    }

    /**
     * 删除管理员
     * @param int $id 要删除的用户
     * @param int $login_admin_user_id 当前登录的用户
     */
    public static function delete(int $id, int $login_admin_user_id)
    {
        if ($id == $login_admin_user_id) {
            abort('不能删除自己');
        }
        AdminUserModel::destroy($id);
    }

    /**
     * 管理员锁定状态修改
     * @param array $data
     */
    public static function updateStatus(array $data)
    {
        if (! isset($data['id']) || ! isset($data['status'])) {
            abort('参数错误');
        }
        AdminUserModel::update([
            'id'     => $data['id'],
            'status' => $data['status']
        ]);
    }

    /**
     * 修改自己的登录密码
     * @param array $data
     * @param int $adminUserId 当前登录用户的id
     */
    public static function updatePassword(array $data, int $adminUserId)
    {
        try {
            validate(AdminUserValidate::class)->scene('update_password')->check($data);

            // 判断原密码是否正确
            $oldPassword = AdminUserModel::where('id', $adminUserId)->value('password');
            if (! password_verify($data['password'], $oldPassword)) {
                abort('原密码错误');
            }
            // 判断两次密码输入是否一致
            if ($data['new_password'] != $data['confirm_password']) {
                abort('新密码两次输入不一致');
            }
            AdminUserModel::update([
                'id'       => $adminUserId,
                'password' => $data['new_password']
            ]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改自己的资料
     * @param array $data
     * @param int $login_admin_user_id 要修改的id，就是当前登录用户的id
     */
    public static function updateInfo(array $data, int $admin_user_id)
    {
        try {
            validate(AdminUserValidate::class)->scene('update_info')->check($data);

            $data['id'] = $admin_user_id;
            AdminUserModel::update($data);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取用户的资料，主要是包括权限节点
     * @param int $id
     */
    public static function getAdminUser(int $admin_user_id)
    {
        $data = AdminUserModel::with(['AdminRole'])
            ->find($admin_user_id)
            ->toArray();

        // 用户拥有的权限节点
        if ($data['id'] == 1) {
            $data['menu'] = AdminMenuModel::field('*')
                ->order('sort asc,id desc')
                ->select();
        } else {
            $data['menu'] = AdminRoleMenuModel::alias('arm')
                ->join('AdminMenu am', 'arm.admin_menu_id = am.id')
                ->where('arm.admin_role_id', $data['admin_role_id'])
                ->field('am.*')
                ->order('am.sort asc,am.id desc')
                ->select();
        }
        return $data;
    }
}