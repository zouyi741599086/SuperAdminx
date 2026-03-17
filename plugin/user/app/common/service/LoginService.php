<?php
namespace plugin\user\app\common\service;

use plugin\user\app\common\logic\login\{WechatMiniLogic, WechatMpLogic, SmsLogic, JwtTokenLogic, RegisterLogic};
use plugin\user\app\common\factory\LoginLogicFactory;
use app\utils\WechatMiniUtils;

/**
 * 登录服务
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class LoginService
{

    public function __construct(
        private WechatMiniLogic $wechatMiniLogic,
        private WechatMpLogic $wechatMpLogic,
        private JwtTokenLogic $jwtTokenLogic,
        private RegisterLogic $registerLogic,
        private SmsLogic $smsLogic,
    ) {}

    /**
     * 处理登录
     * @param array $data 登录数据
     */
    public function login(array $data) : array
    {
        $client = request()->client;

        $loginLogic = LoginLogicFactory::create($client);

        // 验证参数
        $loginLogic->validate($data);

        // 检查是否已注册
        $userId = $loginLogic->getRegisteredUserId($data);

        // 用户不存在则注册
        if (! $userId) {
            $userId = $this->registerLogic->register($data);
        }

        // 生成Token和用户信息
        return $this->jwtTokenLogic->getUserWithToken($userId);
    }

    /** 
     * 微信小程序自动登录
     * @param string $code uni.login获取到的code
     * @return array 用户信息
     * */
    public function weixinMiniAutoLogin(string $code) : array
    {
        $userId = $this->wechatMiniLogic->autoLogin($code);
        if (! $userId) {
            return [];
        }

        return $this->jwtTokenLogic->getUserWithToken($userId);
    }

    /** 
     * 微信公众号自动登录
     * @param string $openid 微信公众号openid
     * @param ?string $unionid 微信unionid
     * @return array 用户信息
     * */
    public function weixinMpAutoLogin(string $openid, ?string $unionid = null) : array
    {
        $userId = $this->wechatMpLogic->autoLogin($openid, $unionid);
        if (! $userId) {
            return [];
        }

        return $this->jwtTokenLogic->getUserWithToken($userId);
    }

    /**
     * 微信小程序获取手机号
     * @param string $code button.getPhoneNumber 获取到的code
     * @return string 手机号
     */
    public function getWechatMiniPhoneNumber(string $code) : string
    {
        return WechatMiniUtils::getPhoneNumber($code);
    }

    /**
     * 发送登录验证码
     * @param string $tel 手机号
     * @return string 验证码
     */
    public function sendCode(string $tel) : string
    {
        return $this->smsLogic->sendCode($tel);
    }

}