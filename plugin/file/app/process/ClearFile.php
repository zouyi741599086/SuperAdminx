<?php
namespace plugin\file\app\process;

use Workerman\Crontab\Crontab;
use support\Log;
use plugin\file\app\common\logic\FileLogic;
use plugin\file\app\common\model\FileModel;

/**
 * 定时任务，清理file表中没使用的文件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class ClearFile
{
    public function onWorkerStart()
    {
        // 每天的2点10执行一次，删除数据库里面一天前上传没有使用的文件
        new Crontab('10 2 * * *', function ()
        {
            if (config('plugin.file.superadminx.clear_file')) {
                $fileIds = FileModel::where([
                    ['create_time', '<=', date('Y-m-d H:i:s', time() - 86400)],
                    ['count', '=', 0]
                ])->column('id');
                $fileIds && FileLogic::delete([['id', 'in', $fileIds]]);
            }
        });

        // 每天的3点30执行一次，删除storage目录里面的空目录
        new Crontab('30 3 * * *', function ()
        {
            $path = './public/storage';
            $this->deleteEmptyFolders($path, false);
        });
    }

    /**
     * 删除目录下的空目录
     * @param string $dirPath 要删除的父目录
     * @param boolean $isDelete 是否删除当前根目录
     **/
    function deleteEmptyFolders(string $dir, bool $isDelete = true)
    {
        if (! is_dir($dir)) {
            return;
        }

        $entries = scandir($dir);
        if ($entries === false) {
            return;
        }

        // 过滤系统目录
        $entries = array_diff($entries, ['.', '..']);

        foreach ($entries as $entry) {
            $path = $dir . DIRECTORY_SEPARATOR . $entry;

            // 只处理目录
            if (is_dir($path)) {
                // 递归处理子目录
                $this->deleteEmptyFolders($path);
            }
        }

        // 重新扫描检查是否为空 (排除根目录)
        $currentEntries = scandir($dir);
        $currentEntries = array_diff($currentEntries, ['.', '..']);

        // 删除空目录 (排除根目录)
        if (empty($currentEntries) && $isDelete) {
            rmdir($dir);
        }
    }


}