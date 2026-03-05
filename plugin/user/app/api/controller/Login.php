<?php
namespace plugin\user\app\api\controller;

use support\Request;
use support\Response;
use plugin\user\app\common\service\LoginService;

/**
 * 小程序登录相关
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

    public function __construct(
        private LoginService $loginService,
    ) {}

    /** 
     * 微信小程序自动登录
     * @method get
     * @param Request $request 
     * @param string $code uni.login获取到的code
     * @return Response
     * */
    public function weixinMiniAutoLogin(Request $request, string $code)
    {
        if ($user = $this->loginService->weixinMiniAutoLogin($code)) {
            return success($user);
        }
        return error("用户未注册");
    }

    /** 
     * 微信公众号自动登录
     * @method get
     * @param Request $request 
     * @param string $openid 微信公众号的openid
     * @return Response
     * */
    public function weixinMpAutoLogin(Request $request, string $openid)
    {
        $unionid = $request->get('unionid');
        if ($user = $this->loginService->weixinMpAutoLogin($openid, $unionid)) {
            return success($user);
        }
        return error("用户未注册");
    }

    /**
     * 微信小程序授权获取用户手机号
     * @method get
     * @param Request $request 
     * @param string $code button.getPhoneNumber 返回的code
     * @return Response
     * */
    public function mpWeixinGetPhoneNumber(Request $request, string $code)
    {
        $result = $this->loginService->getWechatMiniPhoneNumber($code);
        return success($result);
    }

    /**
     * 手机号登录方式获取验证码
     * @method post
     * @param Request $request
     * @param string $tel 手机号
     * @return Response
     */
    public function getLoginCode(Request $request, string $tel) : Response
    {
        $this->loginService->sendCode($tel);
        return success([], "发送成功");
    }

    /**
     * 用户登录/注册提交
     * @method post
     * @param Request $request 
     * @param string $code 
     * @return Response
     * */
    public function login(Request $request)
    {
        $params = $request->post();
        $result = $this->loginService->login($params);
        return success($result, '登录成功');
    }
}
