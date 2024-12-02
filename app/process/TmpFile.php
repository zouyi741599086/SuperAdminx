<?php
namespace app\process;

use Workerman\Crontab\Crontab;
use support\Log;
use app\common\logic\FileLogic;
use app\common\model\FileModel;

/**
 * 定时任务，清理tmp_file中的文件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class TmpFile
{
    public function onWorkerStart()
    {
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
    }
}