<?php
namespace app\common\model;

/**
 * 后台链接权限模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminMenuModel extends BaseModel
{
    // 表名
    protected $name = 'admin_menu';

    // 查询字段
    public function searchHiddenAttr($query, $value, $data)
    {
        if (! $value) {
            $query->where('hidden', '=', 1);
        }
    }
}