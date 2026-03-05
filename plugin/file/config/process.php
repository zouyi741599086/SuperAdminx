<?php
$result = [
    'FileProcess'    => [
        'handler' => plugin\file\app\process\FileProcess::class,
    ],
];

return getenv('CRONTAB') == 'true' ? $result : [];