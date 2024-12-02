<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\AdminUserLogic;
use app\common\model\AdminUserModel;
use app\utils\Jwt;

/**
 * 后台登录
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Login
{
    // 此控制器是否需要登录
    protected $onLogin = false;
    // 不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * @log 后台登录
     * @method post
     * @param Request $request 
     * @return Response
     * */
    public function index(Request $request): Response
    {
        $username = $request->post('username');
        $password = $request->post('password');

        // 验证参数
        if (! $username || ! $password) {
            return error('用户名或密码错误');
        }

        // 查询用户
        $adminUser = AdminUserModel::where('username', $username)->find();
        // 判断用户是否存在
        if (! $adminUser || ! password_verify($password, $adminUser['password'])) {
            return error('用户名或密码错误');
        }
        if ($adminUser['status'] == 2) {
            return error('帐号已被锁定');
        }

        // 更新用户登录的ip和时间
        AdminUserModel::update([
            'id'        => $adminUser['id'],
            'last_time' => time(),
            'lastip'    => $request->getRealIp(true)
        ]);

        $adminUser          = AdminUserLogic::getAdminUser($adminUser['id']);
        $adminUser['token'] = Jwt::generateToken('admin_pc', $adminUser);
        return success($adminUser, '登录成功');
    }
}
