<?php
namespace plugin\admin\app\common\logic\adminUser;

use plugin\admin\app\common\model\AdminUserModel;
use plugin\admin\app\common\validate\AdminUserValidate;

/**
 * 后台用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserExecuteLogic
{

    /**
     * 添加管理员
     * @param array $params
     */
    public function create(array $params)
    {
        try {
            think_validate(AdminUserValidate::class)->scene('create')->check($params);

            AdminUserModel::create($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改管理员
     * @param array $params
     */
    public function update(array $params)
    {
        try {
            think_validate(AdminUserValidate::class)->scene('update')->check($params);

            // 没修改密码则干掉此字段
            if (isset($params['password']) && ! $params['password']) {
                unset($params['password']);
            }
            AdminUserModel::update($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除管理员
     * @param int $id 要删除的用户
     * @param int $adminUserId 当前登录的用户
     */
    public function delete(int $id, int $adminUserId)
    {
        if ($id == $adminUserId) {
            abort('不能删除自己');
        }
        AdminUserModel::destroy($id);
    }

    /**
     * 管理员锁定状态修改
     * @param array $data
     */
    public function updateStatus(array $data)
    {
        if (! isset($data['id']) || ! isset($data['status'])) {
            abort('参数错误');
        }
        AdminUserModel::update([
            'id'     => $data['id'],
            'status' => $data['status'],
        ]);
    }

    /**
     * 修改自己的登录密码
     * @param array $data
     * @param int $adminUserId 当前登录用户的id
     */
    public function updatePassword(array $data, int $adminUserId)
    {
        try {
            think_validate(AdminUserValidate::class)->scene('update_password')->check($data);

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
                'password' => $data['new_password'],
            ]);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改自己的资料
     * @param array $data
     * @param int $adminUserId 要修改的id，就是当前登录用户的id
     */
    public function updateInfo(array $data, int $adminUserId)
    {
        try {
            $data['id'] = $adminUserId;
            think_validate(AdminUserValidate::class)->scene('update_info')->check($data);

            AdminUserModel::update($data);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

}