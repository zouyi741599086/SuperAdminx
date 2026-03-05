<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\logic\user\UserQueryLogic;

/**
 * 用户导出逻辑
 */
class UserExportLogic
{

    public function __construct(
        private UserQueryLogic $userQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params) : array
    {
        try {
            $list    = $this->userQueryLogic->getList($params, false)->cursor();
            $tmpList = [];

            foreach ($list as $v) {
                $tmpList[] = [
                    $v->name ?? '',
                    $v->tel ?? '',
                    $v->status == 1 ? '正常' : '禁用',
                    $v->PUser->name ?? '--',
                    $v->PUser->tel ?? '--',
                    $v->create_time ?? '',
                ];
            }

            $header = ['昵称', '手机号', '状态', '上级用户昵称', '上级用户手机号', '注册时间'];
            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "用户.xlsx",
            ];
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }
}