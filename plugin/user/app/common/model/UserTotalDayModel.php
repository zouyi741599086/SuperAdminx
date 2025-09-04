<?php
namespace plugin\user\app\common\model;

use app\common\model\BaseModel;

/**
 * 用户日统计 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserTotalDayModel extends BaseModel
{

    // 表名
    protected $name = 'user_total_day';

    // 自动时间戳
    protected $autoWriteTimestamp = false;

    // 字段类型转换
    protected $type = [
        'count' => 'integer',
    ];

    // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
    protected $file = [
    ];


    // 日期 搜索器
    public function searchDateAttr($query, $value, $data)
    {
        $query->where('date', '=', $value);
    }


}