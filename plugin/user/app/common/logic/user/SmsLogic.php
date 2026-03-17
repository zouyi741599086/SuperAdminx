<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;
use Webman\RateLimiter\Limiter;
use support\Cache;

/**
 * 用户修改手机号 验证码逻辑
 */
class SmsLogic
{

    /**
     * 获取验证码
     * @param string $tel 新手机号
     * @return string 验证码
     */
    public function sendCode(string $tel) : string
    {
        $request = request();
        think_validate([
            'tel|手机号' => 'require|mobile',
        ])->check(['tel' => $tel]);

        // 60秒内只能发一次
        Limiter::check(
            "sms_{$tel}",
            1,
            60,
            '一分钟内只能发送一次验证码',
        );

        if ($tel == $request->user->tel) {
            abort('手机号不能和当前手机号一致');
        }

        if (UserModel::where('tel', $tel)->value('id')) {
            abort('手机号已存在');
        }

        $code = get_str(4);
        // 发送验证码
        // if (! sms_send($params['tel'], $code)) {
        //     abort('发送验证码失败');
        // }
        Cache::set("update_tel_code_{$tel}", $code, 60);
        return $code;
    }

    /**
     * 验证手机验证码
     * @param array $params 参数
     * @return void
     */
    public function validateCode(string $tel, string $code) : void
    {
        $checkCode = Cache::get("update_tel_code_{$tel}");
        if (! $checkCode) {
            throw new \Exception('验证码已过期');
        }

        if ($checkCode != $code) {
            throw new \Exception('验证码错误');
        }

        Cache::delete("update_tel_code_{$tel}");
    }
}