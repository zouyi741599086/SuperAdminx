<?php
namespace app\api\controller;

use support\Request;
use support\Response;
use app\utils\Jwt;
use app\common\logic\UserLogic;
use app\common\model\UserModel;

/**
 * 小程序登录相关
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Login
{
    //此控制器是否需要登录
    protected $onLogin = false;
    //不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * @log 登录
     * @method post
     * @param Request $request 
     * @return Response
     * */
    public function index(Request $request) : Response
    {
        $tel      = $request->post('tel');
        $password = $request->post('password');
        //验证参数
        if (! $tel || ! $password) {
            return error('用户名或密码错误');
        }

        //查询用户
        $user = UserModel::where('tel', $tel)->find();
        //判断用户是否存在
        if (! $user || ! password_verify($password, $user['password_hash'])) {
            return error('手机号或密码错误');
        }
        if ($user['status'] == 2) {
            return error('帐号已被锁定');
        }

        $user          = UserLogic::findData($user['id']);
        $user['token'] = Jwt::generateToken([
            'id'   => $user['id'],
            'name' => $user['name'],
            'tel'  => $user['tel']
        ], 'user_pc');
        return success($user, '登录成功');
    }
}
