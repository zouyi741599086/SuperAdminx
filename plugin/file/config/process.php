<?php
$result = [
    // ��ʱ���ûʹ�õĸ���
    'clearFile' => [
        'handler' => plugin\file\app\process\ClearFile::class,
    ],
    // ��ʱ�����ʱ�ļ�
    'ClearTmpFile'   => [
         'handler' => plugin\file\app\process\ClearTmpFile::class,
    ],
];

return getenv('CRONTAB') == 'true' ? $result : [];