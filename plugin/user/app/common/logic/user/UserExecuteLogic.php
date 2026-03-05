<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\validate\UserValidate;
use plugin\user\app\common\logic\user\UserTreeLogic;
use plugin\user\app\common\logic\login\RegisterLogic;
use support\think\Db;

/**
 * 用户基础逻辑
 */
class UserExecuteLogic
{
    public function __construct(
        private UserTreeLogic $userTreeLogic,
        private RegisterLogic $registerLogic,
    ) {}

    /**
     * 新增用户
     * @param array $params 参数
     * @return void
     */
    public function create(array $params) : void
    {
        Db::startTrans();
        try {
            think_validate(UserValidate::class)->check($params);
            $result = UserModel::create($params);
            $result->UserInfo()->save($params);

            // 更新上级路径
            $this->userTreeLogic->updatePidPath($result->id);
            // 初始化用户
            $this->registerLogic->afterRegister($result);

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }

    }

    /**
     * 后台更新
     */
    public function update(array $params)
    {
        Db::startTrans();
        try {
            think_validate(UserValidate::class)->check($params);

            // 如果前端没传上级，则更新为null
            if (! isset($params['pid'])) {
                $params['pid'] = null;
            }
            // 如果有上级，则上级不能是自己，也不能是自己下面的人
            if (isset($params['pid']) && $params['pid']) {
                if ($params['pid'] == $params['id']) {
                    abort('上级不能选择自己');
                }
                if (
                    UserModel::where('pid_path', 'like', "%,{$params['id']},%")
                        ->where('id', '<>', $params['id'])
                        ->where('id', $params['pid'])
                        ->value('id')
                ) {
                    abort('上级不能选择自己下面的用户');
                }
            }

            UserModel::update($params);

            // 更新上级路径
            $this->userTreeLogic->updatePidPath($params['id']);

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 用户状态修改
     * @param int|array $id 用户ID
     * @param int $status 状态
     * @return void
     */
    public function updateStatus(int|array $id, int $status) : void
    {
        try {
            UserModel::where('id', 'in', $id)->update([
                'status' => $status,
            ]);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }
}