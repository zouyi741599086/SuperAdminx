<?php
namespace plugin\file\app\common\model;

use support\think\Model;

/**
 * 数据》附件操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class FileRecordModel extends Model
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'file_record',
            'autoWriteTimestamp' => true,
            'type'               => [
                'files' => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

}