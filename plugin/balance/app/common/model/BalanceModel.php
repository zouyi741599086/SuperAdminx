<?php
namespace plugin\balance\app\common\model;

use app\common\model\BaseModel;
use plugin\user\app\common\model\UserModel;

/**
 * 用户余额 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'balance',
            'autoWriteTimestamp' => true,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 所属用户 搜索器
    public function searchUserIdAttr($query, $value, $data)
    {
        $query->where('user_id', '=', $value);
    }

    // 更新时间 搜索器
    public function searchUpdateTimeAttr($query, $value, $data)
    {
        $query->where('update_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

    // 所属用户 关联模型
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

}