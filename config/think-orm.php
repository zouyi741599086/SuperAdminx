<?php

return [
    'default' => 'mysql',
		
	// 字符串则明确指定时间字段类型 支持 int timestamp datetime date
	'auto_timestamp'  => 'datetime',
	
	// 时间字段配置 配置格式：create_time,update_time
	'datetime_field'  => 'create_time,update_time',
	
    'connections' => [
        'mysql' => [
            // 数据库类型
            'type' => 'mysql',
            // 服务器地址
            'hostname' => getenv('DB_HOST'),
            // 数据库名
            'database' => getenv('DB_NAME'),
            // 数据库用户名
            'username' => getenv('DB_USER'),
            // 数据库密码
            'password' => getenv('DB_PASSWORD'),
            // 数据库连接端口
            'hostport' => getenv('DB_PORT'),
            // 数据库连接参数
            'params' => [
                // 连接超时3秒
                \PDO::ATTR_TIMEOUT => 3,
            ],
            // 数据库编码默认采用utf8
            'charset' => getenv('DB_CHARSET'),
            // 数据库表前缀
            'prefix' => getenv('DB_PREFIX'),
            // 断线重连
            'break_reconnect' => true,
            // 关闭SQL监听日志
            'trigger_sql' => false,
            // 自定义分页类
            'bootstrap' =>  '',
        	// 是否严格检查字段是否存在
        	'fields_strict'     => false,
        	// 开启字段缓存
        	'fields_cache'    => true,
            // Connection pool, supports only Swoole or Swow drivers.
            'pool'            => [ // 连接池配置
                'max_connections'    => 100, // 最大连接数
                'min_connections'    => 1, // 最小连接数
                'wait_timeout'       => 3,    // 从连接池获取连接等待的最大时间，超时后会抛出异常。仅在协程环境有效
                'idle_timeout'       => 60,   // 连接池中连接最大空闲时间，超时后会关闭回收，直到连接数为min_connections
                'heartbeat_interval' => 50, // 连接池心跳检测时间，单位秒，建议小于60秒
            ],
        ],
    ],
];
