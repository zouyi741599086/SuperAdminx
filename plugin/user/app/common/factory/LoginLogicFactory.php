<?php
namespace plugin\user\app\common\factory;

use plugin\user\app\common\logic\login\LoginInterface;
use plugin\user\app\common\logic\login\LoginCommonLogic;
use plugin\user\app\common\logic\login\LoginWechatMiniLogic;
use support\Container;

/**
 * 登录逻辑工厂
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class LoginLogicFactory
{
    /**
     * 创建登录逻辑实例
     * @param string $clientType 客户端类型：app, h5, weixin-mini
     * @return LoginInterface
     */
    public static function create(string $clientType) : LoginInterface
    {
        return match (strtolower($clientType)) {
            'weixin-mini' => Container::get(LoginWechatMiniLogic::class),
            default       => Container::get(LoginCommonLogic::class),
        };
    }
}