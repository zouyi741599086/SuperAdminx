<?php
namespace plugin\other\app\common\logic\payRecord;

use plugin\other\app\common\model\PayRecordModel;
use think\facade\Db;

/**
 * 支付记录
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecordExecuteLogic
{

    /**
     * 新增
     * @param array $parmas
     */
    public function create(array $parmas)
    {
        Db::startTrans();
        try {
            PayRecordModel::create($parmas);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}