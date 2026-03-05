<?php
namespace plugin\balance\app\common\logic\balanceDetails;

use plugin\balance\app\common\model\BalanceDetailsModel;

/**
 * 用户余额明细模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DetailsModel
{
    /**
     * 根据余额类型获取对应的余额明细的模型
     * @param string $balanceType 余额类型，用来当模型的后缀
     * @param string $submeterMonth 分表的月份，如2025-01，也会用来当模型后缀
     */
    public function getModel(string $balanceType, ?string $submeterMonth = null)
    {
        if (! $balanceType) {
            abort('余额模型类型错误');
        }
        $suffix = "_{$balanceType}";

        // 判断是否有使用分表
        $balanceTypeList = config('plugin.balance.superadminx.balance_type', 'array');
        foreach ($balanceTypeList as $key => $value) {
            if ($value['field'] == $balanceType && isset($value['submeter_start_month']) && $value['submeter_start_month']) {
                $date    = \DateTime::createFromFormat('Y-m', $submeterMonth ?: date('Y-m'));
                $suffix .= '_' . $date->format('y') . $date->format('m');
                break;
            }
        }

        return BalanceDetailsModel::suffix($suffix);
    }

}