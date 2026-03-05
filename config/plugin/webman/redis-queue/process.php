<?php
return [
    // 现金抽奖 计算用户是否中奖
    'LotteryQueue' => [
        'handler'     => Webman\RedisQueue\Process\Consumer::class,
        'eventLoop'   => match (env('EVENT_LOOP', '')) {
            'Swoole' => Workerman\Events\Swoole::class,
            'Swow'   => Workerman\Events\Swow::class,
            'Fiber'  => Workerman\Events\Fiber::class,
            default  => ''
        },
        'count'       => 2, // 可以设置多进程同时消费
        'constructor' => [
            // 消费者类目录
            'consumer_dir' => base_path() . '/plugin/lottery/app/queue'
        ],
    ],
    // 订单 相关任务
    'ShopQueue' => [
        'handler'     => Webman\RedisQueue\Process\Consumer::class,
        'eventLoop'   => match (env('EVENT_LOOP', '')) {
            'Swoole' => Workerman\Events\Swoole::class,
            'Swow'   => Workerman\Events\Swow::class,
            'Fiber'  => Workerman\Events\Fiber::class,
            default  => ''
        },
        'count'       => 2, // 可以设置多进程同时消费
        'constructor' => [
            // 消费者类目录
            'consumer_dir' => base_path() . '/plugin/shop/app/queue'
        ],
    ],
];