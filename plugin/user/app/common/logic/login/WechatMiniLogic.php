<?php
namespace plugin\user\app\common\logic\login;

use app\utils\WechatMiniUtils;
use plugin\user\app\common\model\UserInfoModel;

/**
 * 微信小程序相关逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class WechatMiniLogic
{
    /**
     * 微信小程序自动登录
     * @param string $code uni.login获取到的code
     * @return int|null 用户ID
     */
    public function autoLogin(string $code) : int|null
    {
        $result = WechatMiniUtils::getOpenid($code);

        if (empty($result['openid'])) {
            throw new \Exception('获取openid失败');
        }

        // 使用openid登录
        $userIds = UserInfoModel::where('weixin_mini_openid', $result['openid'])->column('id');

        // 使用unionid登录
        if (! $userIds && isset($result['unionid']) && $result['unionid']) {
            $userIds = UserInfoModel::where('weixin_unionid', $result['unionid'])->column('id');
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
     * @param array $wechatData 微信数据
     */
    public function bindWechatMiniOpenId(int $userId, array $wechatData) : void
    {
        $updateData = [
            'weixin_mini_openid' => $wechatData['openid'],
            'weixin_unionid'     => $wechatData['unionid'] ?? null,
        ];

        UserInfoModel::where('user_id', $userId)->update($updateData);
    }
}