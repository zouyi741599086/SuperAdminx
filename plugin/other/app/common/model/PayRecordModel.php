<?php
namespace plugin\other\app\common\model;

use app\common\model\BaseModel;
use plugin\user\app\common\model\UserModel;

/**
 * 支付记录 模型
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecordModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'pay_record',
            'autoWriteTimestamp' => false,
            'type'               => [
                'content' => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 用户 搜索器
    public function searchUserIdAttr($query, $value, $data)
    {
        $query->where('user_id', '=', $value);
    }

    // 类型 搜索器
    public function searchTypeAttr($query, $value, $data)
    {
        $query->where('type', '=', $value);
    }

    // 支付方式 搜索器
    public function searchPayTypeAttr($query, $value, $data)
    {
        $query->where('pay_type', '=', $value);
    }

    // 支付来源 搜索器
    public function searchPaySourceAttr($query, $value, $data)
    {
        $query->where('pay_source', '=', $value);
    }

    // 我方订单号 搜索器
    public function searchOutTradeNoAttr($query, $value, $data)
    {
        $query->where('out_trade_no', 'like', "%{$value}%");
    }

    // 支付放订单号 搜索器
    public function searchOrdernoAttr($query, $value, $data)
    {
        $query->where('orderno', 'like', "%{$value}%");
    } 

    // 支付时间 搜索器
    public function searchSuccessTimeAttr($query, $value, $data)
    {
        $query->where('success_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

    // 所属用户 关联模型
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

}