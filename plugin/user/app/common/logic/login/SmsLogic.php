<?php
namespace plugin\user\app\common\logic\login;

use Webman\RateLimiter\Limiter;
use support\Cache;

/**
 * 短信验证码逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class SmsLogic
{
    /**
     * 发送登录验证码
     * @param string $tel 手机号
     * @return string 验证码
     */
    public function sendCode(string $tel) : string
    {
        // 频率限制
        Limiter::check(
            "sms_{$tel}",
            1,
            60,
            '一分钟内只能发送一次验证码',
        );

        $code = get_str(4);
        if (! send_sms($tel, "您的验证码是：{$code}，有效期10分钟，请勿转发！")){
            abort('验证码发送失败');
        }

        Cache::set("login_code_{$tel}", $code, 600);
        return $code;
    }

    /**
     * 验证短信验证码
     * @param string $tel 手机号
     * @param string $code 验证码
     * @return bool 验证结果
     */
    public function validateCode(string $tel, string $code) : bool
    {
        $checkCode = Cache::get("login_code_{$tel}");
        if (! $checkCode) {
            throw new \Exception('验证码已过期');
        }

        if ($checkCode != $code) {
            throw new \Exception('验证码错误');
        }

        Cache::delete("login_code_{$tel}");
        return true;
    }
}