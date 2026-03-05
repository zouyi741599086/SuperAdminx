<?php
namespace plugin\balance\app\common\logic\balanceDetails;

use plugin\balance\app\common\model\BalanceModel;
use plugin\balance\app\common\logic\balanceDetails\DetailsModel;
use plugin\balance\app\common\validate\BalanceDetailsValidate;

/**
 * 用户余额明细 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DetailsQueryLogic
{

    public function __construct(
        private DetailsModel $detailsModel,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param array $with 关联模型
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], array $with = [], bool $page = true)
    {
        $model = $this->detailsModel->getModel($params['balance_type'], $params['submeter_month'] ?? null);
        $list  = $model->withSearch(
            ['user_id', 'title', 'details_type', 'mon', 'create_time'],
            $params,
            true,
        )
            ->with($with)
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "id desc";
                $query->order(get_admin_order_by($orderBy, $params));
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

}