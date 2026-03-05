<?php
namespace plugin\news\app\common\validate;

use superadminx\think_validate\Validate;

/**
 * 收藏文章 验证器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsCollectValidate extends Validate
{

    // 验证规则
    protected $rule = [
        'user_id|用户' => 'require',
        'news_id|文章' => 'require',
    ];

}