<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'config',
            'autoWriteTimestamp' => true,
            'type'               => [
                'content'       => 'json',
                'fields_config' => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'content' => 'array',
            ],
        ];
    }

    //类型 查询字段
    public function searchTypeAttr($query, $value, $data)
    {
        $query->where('type', '=', $value);
    }

    //英文名称 查询字段
    public function searchNameAttr($query, $value, $data)
    {
        $query->where('name', 'like', "%{$value}%");
    }

    //配置名称 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }
}