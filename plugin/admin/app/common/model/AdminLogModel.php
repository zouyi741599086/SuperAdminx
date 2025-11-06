<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 操作日志
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLogModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_log',
            'autoWriteTimestamp' => true,
            'updateTime'         => false,
            'type'               => [
                'request_header' => 'json',
                'request_get'    => 'json',
                'request_post'   => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $query->where('name', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchTelAttr($query, $value, $data)
    {
        $query->where('tel', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

}