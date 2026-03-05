<?php
namespace plugin\user\app\common\logic\login;

use plugin\user\app\common\logic\login\LoginInterface;
use plugin\user\app\common\logic\login\SmsLogic;
use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\model\UserInfoModel;
use plugin\user\app\common\logic\login\WechatMpLogic;

/**
 * 默认登录逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class LoginCommonLogic implements LoginInterface
{

    public function __construct(
        private SmsLogic $smsLogic,
        private WechatMpLogic $wechatMpLogic,
    ) {}

    /**
     * 验证参数
     * @param array $data
     * @return void
     */
    public function validate(array &$data) : void
    {
        think_validate([
            'sms_code|验证码' => 'require',
            'tel|手机号'      => 'require',
        ])->check($data);

        $this->smsLogic->validateCode($data['tel'], $data['sms_code']);
    }

    /**
     * 用户是否已注册
     * @param array $data 参数
     * @return int|null 用户ID
     */
    public function getRegisteredUserId(array &$data) : ?int
    {
        $userId = UserModel::where('status', 1)
            ->where('tel', $data['tel'])
            ->value('id');

        // 重新绑定用户的openid
        $weixinMpOpenid = request()->post('weixin_mp_openid');
        if ($userId && $weixinMpOpenid) {
            $this->wechatMpLogic->bindWechatMpOpenId(
                $userId,
                $weixinMpOpenid,
                request()->post('weixin_unionid'),
            );
        }

        return $userId;
    }
}