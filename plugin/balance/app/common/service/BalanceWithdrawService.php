<?php
namespace plugin\balance\app\common\service;

use plugin\balance\app\common\logic\balanceWithdraw\{WithdrawQueryLogic, WithdrawExecuteLogic, WithdrawExportLogic, WithdrawUpdateStaticLogic};

/**
 * 余额提现
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceWithdrawService
{

    public function __construct(
        private WithdrawQueryLogic $withdrawQueryLogic,
        private WithdrawExecuteLogic $withdrawExecuteLogic,
        private WithdrawUpdateStaticLogic $withdrawUpdateStaticLogic,
        private WithdrawExportLogic $withdrawExportLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        return $this->withdrawQueryLogic->getList($params, $with, $page);
    }

    /**
     * 新增，申请提现
     * @param array $params
     */
    public function create(array $params, )
    {
        return $this->withdrawExecuteLogic->create($params);
    }

    /**
     * 获取数据
     * @param int $id 数据id
     * @param array $with 关联模型
     */
    public function findData(int $id, array $with = ['User'])
    {
        return $this->withdrawQueryLogic->findData($id, $with);
    }

    /**
     * 获取最后一次提现的详情
     * @param int $userId 用户id
     */
    public function getLastInfo(int $userId)
    {
        return $this->withdrawQueryLogic->getLastInfo($userId);
    }

    /**
     * 更新状态
     * @param int|array $id
     * @param int $status
     * @param string $reason
     * @return void
     */
    public function updateStatus(int|array $id, int $status, string $reason = '') : void
    {
        $this->withdrawUpdateStaticLogic->updateStatus($id, $status, $reason);
    }


    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public function exportData(array $params)
    {
        return $this->withdrawExportLogic->exportData($params);
    }

}