<?php
namespace plugin\balance\app\common\logic\balanceDetails;

use plugin\balance\app\common\logic\balanceDetails\DetailsQueryLogic;

/**
 * 导出用户余额明细
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DetailsExportLogic
{

    public function __construct(
        private DetailsQueryLogic $detailsQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public  function exportData(array $params)
    {
        try {
            $balanceTypeList  = config('plugin.balance.superadminx.balance_type');
            $balanceTypeTitle = '';
            $detailsTypeList  = [];
            foreach ($balanceTypeList as $v) {
                if ($v['field'] == $params['balance_type']) {
                    $balanceTypeTitle = $v['title'];
                    $detailsTypeList  = $v['details_type'];
                    break;
                }
            }

            $model = $this->detailsQueryLogic->getList($params, page: false);
            if ($model->count() > 100 * 10000) {
                abort('每次最多导出100万条数据，请筛选条件减少数据~');
            }

            $tmpList = [];
            $list    = $this->detailsQueryLogic->getList($params, page: false)->cursor();
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v->user_id,
                    $v->title ?? '',
                    $v->details_type ? ($detailsTypeList[$v->details_type] ?? '--') : '--',
                    $v->change_value,
                    $v->change_balance ?? '',
                    $v->create_time ?? '',
                ];
            }

            // 表格头
            $header = ['用户ID', '标题', '明细类型', '变更值', '变更后余额', '变化时间'];
            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "{$balanceTypeTitle}明细.xlsx",
            ];
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

}