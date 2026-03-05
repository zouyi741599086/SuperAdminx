<?php
namespace plugin\news\app\common\model;

use app\common\model\BaseModel;

/**
 * 文章模型
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'news',
            'autoWriteTimestamp' => true,
            'type'               => [
                'img' => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'img'     => 'array',
                'content' => 'editor',
            ],
        ];
    }
   
    /**
     * 文章的分类
     */
    public function newsClass()
    {
        return $this->belongsTo(NewsClassModel::class);
    }

    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }

    // 查询字段
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', 'like', $value);
    }

    // 查询字段
    public function searchNewsClassIdAttr($query, $value, $data)
    {
        $news_class_id_arr = NewsClassModel::where('pid_path', 'like', "%,{$value},%")->column('id');
        $query->where('news_class_id', 'in', $news_class_id_arr);
    }

    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }
}