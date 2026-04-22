<?php
namespace plugin\admin\app\common\model;

use app\common\model\BaseModel;
use plugin\admin\app\common\model\AdminUserModel;

/**
 * 待办事项 模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminTodoModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'admin_todo',
            'autoWriteTimestamp' => true,
            'type'               => [
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 日期 获取器
    public function getDateAttr($value)
    {
        return date('Y-m-d H:i', strtotime($value));
    }

    // 用户 搜索器
    public function searchAdminUserIdAttr($query, $value, $data)
    {
        $query->where('admin_user_id', '=', $value);
    }

    // 日期 搜索器
    public function searchDateAttr($query, $value, $data)
    {
        $query->whereDay('date', $value);
    }

    // 状态 搜索器
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', '=', $value);
    }


    // 用户 关联模型
    public function AdminUser()
    {
        return $this->belongsTo(AdminUserModel::class);
    }


}