<?php
namespace plugin\news\app\common\model;

use app\common\model\BaseModel;

/**
 * 文章分类模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClassModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'news_class',
            'autoWriteTimestamp' => true,
            'type'               => [],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'img' => '',
            ],
        ];
    }

    // 状态 搜索器
    public function searchStaticAttr($query, $value, $data)
    {
        $query->whereLike('static', $value);
    }
}