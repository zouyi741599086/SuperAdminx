<?php
namespace plugin\file\app\common\model;

use support\think\Model;

/**
 * 附件操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class FileModel extends Model
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'file',
            'autoWriteTimestamp' => true,
            'type'               => [
            ],
        ];
    }
}