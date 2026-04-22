<?php
namespace plugin\payRecord\app\common\logic\payRecord;

use plugin\payRecord\app\common\model\PayRecordModel;

/**
 * 支付记录
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecordQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        $list = PayRecordModel::withSearch(
            ['user_id', 'type', 'pay_type', 'pay_source', 'order_id', 'orderno', 'success_time'],
            $params,
            true,
        )
            ->with($with)
            ->order('id desc');

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return PayRecordModel::find($id);
    }
}