<?php
namespace plugin\file\app\common\logic;

use plugin\file\app\common\model\FileRecordModel;
use plugin\file\app\common\logic\FileLogic;

/**
 * 数据》附件操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class FileRecordLogic
{
    /**
     * 添加数据的时候
     * 会将所有文件的count+1
     * @param string $table_name 哪个表里面的数据
     * @param int $table_id 哪条数据里面的附件
     * @param array|string $files 这条数据包含的附件
     */
    public static function create(string $table_name, int $table_id, array $files)
    {
        if ($files && count($files) > 0) {
            // 插入数据
            FileRecordModel::create([
                'table_name' => $table_name,
                'table_id'   => $table_id,
                'files'      => $files
            ]);
            // 文件使用次数+1
            FileLogic::incCount([['url', 'in', $files]]);
        }
    }

    /**
     * 修改数据的时候
     * 会比对新老数据，新附件count+1，删除的附件count-1，没变的附件不变
     * @param string $table_name 哪个表里面的数据
     * @param int $table_id 哪条数据里面的附件
     * @param array|string $files 这条数据包含的附件
     */
    public static function update(string $table_name, int $table_id, array $files)
    {
        $data = FileRecordModel::where([
            ['table_name', '=', $table_name],
            ['table_id', '=', $table_id]
        ])->find();
        // 删除的附件count-1
        FileLogic::decCount([['url', 'in', array_diff($data['files'] ?? [], $files)]]);

        // 新增的附件count+1
        FileLogic::incCount([['url', 'in', array_diff($files, $data['files'] ?? [])]]);

        // 插入数据，相当于原来没得数据，现在有的就要插入
        if (! $data && $files) {
            FileRecordModel::create([
                'table_name' => $table_name,
                'table_id'   => $table_id,
                'files'      => $files
            ]);
        }
        // 相当于原来有数据，更新后没得数据了，就要删除
        if ($data && ! $files) {
            FileRecordModel::destroy($data['id']);
        }
        // 原来有数据，更新后也有数据
        if ($data && $files) {
            FileRecordModel::update([
                'id'    => $data['id'],
                'files' => $files
            ]);
        }
    }

    /**
     * 删除数据的时候
     * @param string $table_name 哪个表里面的数据
     * @param int $table_id 哪条数据里面的附件
     */
    public static function delete(string $table_name, int $table_id)
    {
        $data = FileRecordModel::where([
            ['table_name', '=', $table_name],
            ['table_id', '=', $table_id]
        ])->find();

        if ($data) {
            FileRecordModel::destroy($data['id']);
            // 附件count-1
            FileLogic::decCount([['url', 'in', $data['files']]]);
        }
    }
}