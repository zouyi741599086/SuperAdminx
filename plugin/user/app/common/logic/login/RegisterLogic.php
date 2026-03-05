<?php
namespace plugin\user\app\common\logic\login;

use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\validate\UserValidate;
use plugin\user\app\common\logic\userTotalDay\DayExecuteLogic;
use support\Container;

/**
 * 注册逻辑
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class RegisterLogic
{
    /**
     * 注册用户
     * @param array $data
     *  -- string tel 手机号
     *  -- ?string name 姓名
     *  -- ?string invite_code 邀请码
     *  -- ?string img 头像
     * @return int 用户ID
     */
    public function register(array $data) : int
    {
        // 处理头像
        $data['img'] = isset($data['img']) ? file_url_dec($data['img']) : '/storage/default-tx.png';

        // 处理昵称
        $data['name'] = $data['name'] ?? substr_replace($data['tel'], '****', 3, 4);

        // 验证数据
        think_validate(UserValidate::class)->check($data);

        // 创建用户
        $user = UserModel::create($data);
        $user->UserInfo()->save($data);

        // 处理邀请关系
        $this->handleInvitation($user->id, $data['invite_code'] ?? null);

        // 注册后
        $this->afterRegister($user);

        return $user->id;
    }

    /**
     * 注册后处理邀请关系
     * @param UserModel $user 用户
     * @param string|null $inviteCode 邀请码，格式：from_id_1234
     */
    private function handleInvitation(int $userId, ?string $inviteCode = null) : void
    {
        $pid   = intval(ltrim($inviteCode, 'from_id_'));
        $pUser = $pid ? UserModel::field('id,pid_layer,pid_path')->find($pid) : null;

        if (! $pUser) {
            UserModel::where('id', $userId)->update([
                'pid_path' => ",{$userId},",
            ]);
        }

        if ($pUser) {
            UserModel::where('id', $userId)->update([
                'pid'       => $pUser->id,
                'pid_layer' => $pUser->pid_layer + 1,
                'pid_path'  => "{$pUser->pid_path}{$userId},",
            ]);
        }
    }

    /**
     * 注册后
     * @param UserModel $user 用户
     */
    public function afterRegister(UserModel $user) : void
    {
        // 用户注册日月统计
        $dayExecuteLogic = Container::get(DayExecuteLogic::class);
        $dayExecuteLogic->incCount();

        // 初始化余额
        balance_get($user->id);
    }
}