<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\logic\AdminUserLogic;
use plugin\admin\app\common\model\AdminUserModel;
use app\utils\JwtUtils;

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
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * @log 后台登录
     * @method post
     * @param Request $request 
     * @return Response
     * */
    public function index(Request $request) : Response
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
            'last_time' => date('Y-m-d H:i:s'),
            'lastip'    => $request->getRealIp(true)
        ]);

        $adminUser          = AdminUserLogic::getAdminUser($adminUser['id']);
        $adminUser['token'] = JwtUtils::generateToken('admin', $adminUser);
        return success($adminUser, '登录成功');
    }
}
