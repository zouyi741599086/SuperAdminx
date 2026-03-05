<?php
namespace plugin\user\app\common\logic\login;

use plugin\user\app\common\model\UserModel;
use app\utils\JwtUtils;

/**
 * 登录后生成token 并获取用户信息
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class JwtTokenLogic
{
    /**
     * 生成用户Token
     * @param int $userId 用户ID
     * @param string|null $client 客户端标识
     * @return string 生成的Token
     */
    public function generateForUser(int $userId, ?string $client = null) : string
    {
        $user = UserModel::find($userId);
        if (! $user) {
            throw new \Exception('用户不存在');
        }

        $user   = $user->toArray();
        $client = $client ?: request()->client;
        return JwtUtils::generateToken($client, $user);
    }

    /**
     * 获取用户信息并生成Token
     * @param int $userId 用户id
     * @return array 用户信息
     */
    public function getUserWithToken(int $userId) : array
    {
        $user = UserModel::with(['UserInfo'])->find($userId);

        if (! $user) {
            throw new \Exception('用户不存在');
        }

        $user->img   = file_url($user->img);
        $user->token = $this->generateForUser($userId);

        return $user->toArray();
    }
}