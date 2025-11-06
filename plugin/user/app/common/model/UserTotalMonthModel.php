<?php
namespace plugin\user\app\common\model;

use app\common\model\BaseModel;

/**
 * 用户月统计 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalMonthModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'user_total_month',
            'autoWriteTimestamp' => false,
            'type'               => [
                'count' => 'integer',
            ],
            'file'               => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 月份 搜索器
    public function searchMonthAttr($query, $value, $data)
    {
        $query->where('month', '=', $value);
    }


}