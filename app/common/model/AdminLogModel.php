<?php
namespace app\common\model;

/**
 * 操作日志
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLogModel extends BaseModel
{
    // 表名
    protected $name = 'admin_log';

    // 是否自动完成字段
    protected $updateTime = false;

    // 设置json类型字段
    protected $json = ['request_header', 'request_get', 'request_post'];

    // 查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $value && $query->where('name', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchTelAttr($query, $value, $data)
    {
        $value && $query->where('tel', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $value && $query->where('title', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $value && $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

}