<?php
namespace plugin\payRecord\app\common\model;

use think\model\Pivot;
use plugin\payRecord\app\common\model\PayRecordModel;
use plugin\shop\app\common\model\ShopOrderModel;

/**
 * 订单支付中间表 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class PayRecordShopOrderModel extends Pivot
{
    /**
    * 模型参数
    * @return array
    */
    protected function getOptions() : array
    {
        return [
            'name' => 'pay_record_shop_order',
            'autoWriteTimestamp' => false,
            'type' => [
            ],
            'fileField' => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }



    // 支付记录 关联模型
    public function PayRecord()
    {
        return $this->belongsTo(PayRecordModel::class);
    }
    
    // 商城订单 关联模型
    public function ShopOrder()
    {
        return $this->belongsTo(ShopOrderModel::class);
    }
    

}