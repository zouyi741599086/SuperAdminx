<?php
namespace plugin\balance\app\common\model;

use app\common\model\BaseModel;
use plugin\user\app\common\model\UserModel;

/**
 * 余额提现 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceWithdrawModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'balance_withdraw',
            'autoWriteTimestamp' => true,
            'type'               => [
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

    // 单号 搜索器
    public function searchOrdernoAttr($query, $value, $data)
    {
        $query->where('orderno', 'like', "%{$value}%");
    }

    // 状态 搜索器
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', '=', $value);
    }

    // 姓名 搜索器
    public function searchBankNameAttr($query, $value, $data)
    {
        $query->where('bank_name', 'like', "%{$value}%");
    }

    // 银行 搜索器
    public function searchBankTitleAttr($query, $value, $data)
    {
        $query->where('bank_title', 'like', "%{$value}%");
    }

    // 银行卡号 搜索器
    public function searchBankNumberAttr($query, $value, $data)
    {
        $query->where('bank_number', 'like', "%{$value}%");
    }

    // 申请时间 搜索器
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

    // 审核时间 搜索器
    public function searchAuditTimeAttr($query, $value, $data)
    {
        $query->where('audit_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

    // 失败原因 搜索器
    public function searchReasonAttr($query, $value, $data)
    {
        $query->where('reason', 'like', "%{$value}%");
    }


    // 所属用户 关联模型
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

}