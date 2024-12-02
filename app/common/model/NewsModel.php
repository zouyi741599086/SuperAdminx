<?php
namespace app\common\model;

/**
 * 文章模型
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsModel extends BaseModel
{
    // 表名
    protected $name = 'news';

    // 字段类型转换
    protected $type = [
        'img' => 'json',
    ];

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
        'img'     => 'array',
        'content' => 'editor',
    ];

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
        $value && $query->where('title', 'like', "%{$value}%");
    }
    // 查询字段
    public function searchStatusAttr($query, $value, $data)
    {
        $value && $query->where('status', 'like', $value);
    }
    // 查询字段
    public function searchNewsClassIdAttr($query, $value, $data)
    {
        if ($value) {
            $news_class_id_arr = NewsClassModel::where('pid_path', 'like', "%,{$value},%")->column('id');
            $query->where('news_class_id', 'in', $news_class_id_arr);
        }
    }
    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $value && $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }
}