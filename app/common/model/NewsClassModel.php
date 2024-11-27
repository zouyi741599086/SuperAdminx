<?php
namespace app\common\model;

/**
 * 文章分类模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClassModel extends BaseModel
{
    //表名
    protected $name = 'news_class';

    //包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
        'img' => '',
    ];

}