<?php
namespace plugin\user\app\common\logic\login;

use app\utils\WechatMiniUtils;
use plugin\user\app\common\model\UserInfoModel;

/**
 * 微信公众号相关逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMpLogic
{
    /**
     * 微信公众号自动登录
     * @param string $opneid 微信公众号的openid
     * @param ?string $unionid 
     * @return int|null 用户ID
     */
    public function autoLogin(string $opneid, ?string $unionid = null) : int|null
    {
        // 使用openid登录
        $userIds = UserInfoModel::where('weixin_mp_openid', $opneid)->column('id');

        // 使用unionid登录
        if (! $userIds && $unionid) {
            $userIds = UserInfoModel::where('weixin_unionid', $unionid)->column('id');
        }

        // 用户可能一个微信号通过退出登录，然后重新登录切换不同的手机号实现换账号的功能，所以openid在数据库中非唯一
        if (count($userIds) == 1) {
            return $userIds[0];
        }
        return null;
    }

    /**
     * 绑定用户的微信OpenID
     * @param int $userId 用户ID
     * @param string $openid 微信公众号的openid
     * @param ?string $unionid 微信公众号的unionid
     */
    public function bindWechatMpOpenId(int $userId, string $openid, ?string $unionid = null) : void
    {
        $updateData = [
            'weixin_mp_openid' => $openid,
            'weixin_unionid'   => $unionid,
        ];
        UserInfoModel::where('user_id', $userId)->update($updateData);
    }
}