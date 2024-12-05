<?php
return [
    'enable'       => false,
    'websocket'    => 'websocket://0.0.0.0:3131',
    'api'          => 'http://0.0.0.0:3238',
    'app_key'      => '114882cbddea1ac84bf7759627abefa2',
    'app_secret'   => '3d8b49097bf24f3adf163cd71e62c8b0',
    'channel_hook' => 'http://127.0.0.1:' . getenv('LISTEN_PORT') . '/plugin/webman/push/hook',
    'auth'         => '/plugin/webman/push/auth'
];