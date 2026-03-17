<?php
namespace plugin\user\app\common\logic\login;

use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\logic\login\WechatMiniLogic;
use app\utils\WechatMiniUtils;

/**
 * 微信小程序登录逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class LoginWechatMiniLogic implements LoginInterface
{

    public function __construct(
        private WechatMiniLogic $wechatMiniLogic,
    ) {}


    /**
     * 验证参数
     * @param array $data
     * @return void
     */
    public function validate(array &$data) : void
    {
        think_validate([
            'code|code' => 'require',
            'tel|手机号'   => 'require',
        ])->check($data);
    }

    /**
     * 用户是否已注册
     * @param array $data 参数
     * @return int|null 用户ID
     */
    public function getRegisteredUserId(array &$data) : int|null
    {
        //是否已注册
        $user = UserModel::where('tel', $data['tel'])->find();
        if ($user->status ==  2) {
            abort('账户被锁定~');
        }

        // 重新绑定用户的openid
        if ($user) {
            $result = WechatMiniUtils::getOpenid($data['code']);
            $this->wechatMiniLogic->bindWechatMiniOpenId($user->id, $result);
        }
        return $user->id;
    }
}