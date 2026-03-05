<?php
return [
    'enable' => true,
    'driver' => getenv('REDIS_PASSWORD') ? 'redis' : 'auto', // auto, apcu, memory, redis
    'stores' => [
        'redis' => [
            'connection' => 'limiter',
        ]
    ],
    // 这些ip的请求不做频率限制
    'ip_whitelist' => [
        '127.0.0.1',
    ],
];