<?php
namespace plugin\news\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 文章
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class NewsValidate extends Validate
{

    protected $rule = [
        'news_class_id' => 'require',
        'title'         => 'require',
        'content'       => 'require',
    ];

    protected $message = [
        'news_class_id.require' => '请选择所属分类',
        'title.require'         => '请输入文章标题',
        'content.require'       => '请输入内容',
    ];
}


