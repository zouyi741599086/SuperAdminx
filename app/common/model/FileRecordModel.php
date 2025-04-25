<?php
namespace app\common\model;

use support\think\Model;

/**
 * 数据》附件操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class FileRecordModel extends Model
{
    // 表名
    protected $name = 'file_record';

    // 字段类型转换
    protected $type = [
        'files' => 'json',
    ];

}