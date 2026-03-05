<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\model\UserInfoModel;
use plugin\user\app\common\logic\user\SmsLogic;

/**
 * 修改用户信息
 */
class UpdateUserInfoLogic
{

    public function __construct(
        private SmsLogic $smsCode,
    ) {}

    /**
     * 用户修改自己的资料
     * @param array $params 参数
     * @param int $userId 用户ID
     * @return void
     */
    public function updateInfo(array $params, int $userId) : void
    {
        if (! isset($params['action']) && ! $params['action']) {
            abort('参数错误');
        }

        try {
            $action = $params['action'];

            switch ($action) {
                case 'img':
                    $this->updateImg($params, $userId);
                    break;
                case 'name':
                    $this->updateName($params, $userId);
                    break;
                case 'tel':
                    $this->updateTel($params, $userId);
                    break;
                case 'sex':
                    $this->updateSex($params, $userId);
                    break;
                case 'message_push':
                    $this->updateMessagePush($params, $userId);
                    break;
                default:
                    throw new \Exception('不支持的操作类型');
            }
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改头像
     * @param array $params 参数
     * @param int $userId 用户id
     * @return void
     */
    protected function updateImg(array $params, int $userId) : void
    {
        if (! isset($params['img']) || ! $params['img']) {
            throw new \Exception('参数错误');
        }
        UserModel::update([
            'id'  => $userId,
            'img' => file_url_dec($params['img']),
        ]);
    }

    /**
     * 修改昵称
     * @param array $params 参数
     * @param int $userId 用户id
     * @return void
     */
    protected function updateName(array $params, int $userId) : void
    {
        if (! isset($params['name']) || ! $params['name']) {
            throw new \Exception('参数错误');
        }
        if (mb_strlen($params['name'], 'UTF-8') > 12) {
            throw new \Exception('昵称长度不能超过12个字符');
        }
        UserModel::where('id', $userId)
            ->update(['name' => $params['name']]);
    }

    /**
     * 修改手机号
     * @param array $params 参数
     * @param int $userId 用户id
     * @return void
     */
    protected function updateTel(array $params, int $userId) : void
    {
        if (! isset($params['tel']) || ! $params['tel']) {
            throw new \Exception('参数错误');
        }

        if (
            UserModel::where('tel', $params['tel'])
                ->where('id', '<>', $userId)
                ->value('id')
        ) {
            throw new \Exception('手机号已存在');
        }

        // 如果请求非小程序，则必须要验证码
        if (request()->clident != 'weixin-mini') {
            $this->smsCode->validateCode($params['tel'], $params['code']);
        }

        UserModel::where('id', $userId)
            ->update(['tel' => $params['tel']]);
    }


    /**
     * 修改性别
     * @param array $params 参数
     * @param int $userId 用户id
     * @return void
     */
    protected function updateSex(array $params, int $userId) : void
    {
        if (! isset($params['sex']) || ! $params['sex']) {
            throw new \Exception('参数错误');
        }
        UserModel::where('id', $userId)
            ->update(['sex' => $params['sex']]);
    }

    /**
     * 消息推送开关
     * @param array $params 
     * @param int $userId
     * @return void
     */
    protected function updateMessagePush(array $params, int $userId) : void
    {
        if (! isset($params['message_push']) || ! $params['message_push']) {
            throw new \Exception('参数错误');
        }
        UserInfoModel::where('id', $userId)->update(['message_push' => $params['message_push']]);
    }
}