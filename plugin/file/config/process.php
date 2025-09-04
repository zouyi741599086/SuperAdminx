<?php
$result = [
    // 定时清除没使用的附件
    'clearFile' => [
        'handler' => plugin\file\app\process\ClearFile::class,
    ],
    // 定时清除临时文件
    'ClearTmpFile'   => [
         'handler' => plugin\file\app\process\ClearTmpFile::class,
    ],
];

return getenv('CRONTAB') == 'true' ? $result : [];