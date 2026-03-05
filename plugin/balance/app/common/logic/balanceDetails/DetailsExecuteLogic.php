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
class DetailsExecuteLogic
{

    public function __construct(
        private DetailsModel $detailsModel,
    ) {}

    /**
     * 新增
     * @param array $params
     */
    public function create(array $params)
    {
        try {
            think_validate(BalanceDetailsValidate::class)->check($params);

            $model  = $this->detailsModel->getModel($params['balance_type']);
            $params = array_merge(
                $params,
                [
                    'change_balance' => BalanceModel::where('user_id', $params['user_id'])->value($params['balance_type']),
                    'create_time'    => date('Y-m-d H:i:s'),
                ],
            );
            $model->save($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

}