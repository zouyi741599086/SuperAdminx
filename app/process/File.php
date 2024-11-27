<?php
namespace app\process;

use Workerman\Crontab\Crontab;
use support\Log;
use app\common\logic\FileLogic;
use app\common\model\FileModel;

/**
 * 定时任务，清理file表中没使用的文件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class File
{
    public function onWorkerStart()
    {
        // 每天的2点10执行一次，删除数据库里面一天前上传没有使用的文件
        new Crontab('10 2 * * *', function ()
        {
            $fileIds = FileModel::where([
                ['create_time', '<=', date('Y-m-d H:i:s', time() - 86400)],
                ['count', '=', 0]
            ])->column('id');
            $fileIds && FileLogic::delete([['id', 'in', $fileIds]]);
        });

        // 每天的3点10执行一次，删除excel文件夹里面超过一天的文件
        new Crontab('10 3 * * *', function ()
        {
            try {
                $path  = './public/tmp_file';
                $files = array_diff(scandir($path), array('.', '..'));
                foreach ($files as $v) {
                    $time = filectime("{$path}/{$v}");
                    if (time() - $time > 86400) {
                        @unlink("{$path}/{$v}");
                    }
                }
            } catch (\Exception $e) {
                Log::error($e->getMessage(), []);
            }
        });

        // 每天的3点30执行一次，删除storage目录里面的空目录
        new Crontab('30 3 * * *', function ()
        {
            //删除资源里面的空目录
            $path = './public/storage';
            $this->deleteEmptyDirs($path);
        });
    }

    /**
     * 删除目录下的空目录
     * @param string $dirPath 要删除的父目录
     * @param boolean $isDelete 是否删除此目录
     **/
    function deleteEmptyDirs($dirPath, $isDelete = false)
    {
        // 确保目录存在且为目录  
        if (! is_dir($dirPath)) {
            return;
        }
        // 打开目录并读取内容  
        $items = scandir($dirPath);

        $isEmpty = true;
        foreach ($items as $item) {
            // 排除'.'和'..'  
            if ($item == '.' || $item == '..') {
                continue;
            }
            $fullPath = $dirPath . DIRECTORY_SEPARATOR . $item;

            // 如果当前项是目录，则递归调用  
            if (is_dir($fullPath)) {
                $isEmpty = $this->deleteEmptyDirs($fullPath, true); // 递归删除空子目录，并将isRoot设置为false  
            } else {
                $isEmpty = false;
                break;
            }
        }
        if ($isEmpty && $isDelete) {
            rmdir($dirPath);
        }
        return $isEmpty;
    }


}