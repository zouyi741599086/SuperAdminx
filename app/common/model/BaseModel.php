<?php
namespace app\common\model;

use support\think\Model;
use app\common\logic\FileRecordLogic;

/**
 * 父模型，所有的模型都要继承
 * 主要解决数据增改删的时候同步更新附件表，删除附件等操作
 * 
 * 文件上传的时候count=0
 * 数据添加的时候count+1
 * 数据修改的时候，会比对新老数据，新附件count+1，删除的附件count-1，没变的附件不变
 * 数据删除的时候count-1
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BaseModel extends Model
{

    /**
     * 新增后
     * @param object $data
     */
    public static function onAfterInsert($data)
    {
        if (config('superadminx.clear_file')) {
            $fileUrl   = self::dataSearchFile($data);
            $tableName = $data->name;
            $tableId   = ($data->toArray())['id'] ?? null;

            // 记录这条数据里面所有的附件
            if ($fileUrl && $tableName && $tableId) {
                FileRecordLogic::create($tableName, $tableId, $fileUrl);
            }
        }
    }

    /**
     * 更新后
     * @param object $data
     */
    public static function onAfterUpdate($data)
    {
        if (config('superadminx.clear_file')) {
            $tableName = $data->name;
            $tableId   = ($data->toArray())['id'] ?? null;
            // 重新更新此条数据使用的附件
            if ($tableName && $tableId) {
                $data    = $data->find($tableId); // 重新获取更新后最新的数据，不然只更新某个附件值导致其它附件字段被删除
                $fileUrl = self::dataSearchFile($data);
                if ($fileUrl) {
                    FileRecordLogic::update($tableName, $tableId, $fileUrl);
                }
            }
        }
    }

    /**
     * 删除后
     * @param object $data
     */
    public static function onAfterDelete($data)
    {
        if (config('superadminx.clear_file')) {
            $tableName = $data->name;
            $tableId   = ($data->toArray())['id'];

            // 删除附件记录
            FileRecordLogic::delete($tableName, $tableId);
        }
    }

    /**
     * 添加修改的时候，把数据里面的文件路劲找出来
     */
    private static function dataSearchFile($data)
    {
        $fileUrl = [];
        try {
            $content = $data->toArray();
            if (! isset($data->file) || ! $data->file) {
                return [];
            }
            foreach ($data->file as $k => $v) {
                if (isset($content[$k]) && $content[$k]) {
                    // 直接等于
                    if (($v == '' || ! $v) && isset($content[$k]) && $content[$k]) {
                        $fileUrl[] = $content[$k];
                    }
                    // 数组，支持多维数组，随便多深，想自定义表单的提交数据也可以放进来，把提交的每个值都当成附件路劲处理
                    if ($v == 'array' && isset($content[$k]) && $content[$k]) {
                        $fileUrl = array_merge($fileUrl, self::arrSearchFile($content[$k]));
                    }
                    // 编辑器
                    if ($v == 'editor') {
                        $tmp     = self::editorSearchFile($content[$k]);
                        $fileUrl = array_merge($fileUrl, $tmp);
                    }
                }
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
        return $fileUrl;
    }

    /**
     * 从富文本中找出所有附件路劲
     */
    private static function editorSearchFile($content)
    {
        $fileUrl = [];
        if (! $content) {
            return $fileUrl;
        }
        $pattern = [
            '/]*src=(["\'])(.*?)\1[^>]*>/i',
            '/]*href=(["\'])(.*?)\1[^>]*>/i',
        ];
        foreach ($pattern as $v) {
            preg_match_all($v, $content, $matches);
            $fileUrl = array_merge($fileUrl, $matches[2]);
        }
        return $fileUrl;
    }

    /**
     * 递归数组，把数组中所有值都当成url
     */
    private static function arrSearchFile($arr)
    {
        $fileUrl = [];
        if (is_array($arr)) {
            foreach ($arr as $v) {
                if (is_array($v) && $v) {
                    $fileUrl = array_merge($fileUrl, self::arrSearchFile($v));
                } else if ($v) {
                    $fileUrl[] = $v;
                    $fileUrl   = array_merge($fileUrl, self::editorSearchFile($v));
                }
            }
        }
        return $fileUrl;
    }
}