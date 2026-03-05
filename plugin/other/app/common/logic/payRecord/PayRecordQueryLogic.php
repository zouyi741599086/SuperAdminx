<?php
namespace plugin\other\app\common\logic\payRecord;

use plugin\other\app\common\model\PayRecordModel;

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
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        $list = PayRecordModel::withSearch(
            ['user_id', 'type', 'pay_type', 'pay_source', 'out_trade_no', 'orderno', 'success_time'],
            $params,
            true,
        )
            ->with(['User' => function ($query)
            {
                $query->field('id,img,name,tel');
            }])
            ->order('id desc');

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }
}