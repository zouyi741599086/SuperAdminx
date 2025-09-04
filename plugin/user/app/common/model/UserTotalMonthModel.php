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

    // 表名
    protected $name = 'user_total_month';

    // 自动时间戳
    protected $autoWriteTimestamp = false;

    // 字段类型转换
    protected $type = [
        'count' => 'integer',
    ];

    // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
    protected $file = [
    ];


    // 月份 搜索器
    public function searchMonthAttr($query, $value, $data)
    {
        $query->where('month', '=', $value);
    }


}