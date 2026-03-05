<?php
namespace plugin\news\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 文章分类
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class NewsClassValidate extends Validate
{

    protected $rule = [
        'title' => 'require',
    ];

    protected $message = [
        'title.require' => '请输入名称',

    ];
}


