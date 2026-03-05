<?php

return [
    //后台管理中间件
    'admin'   => [
        //权限验证
        app\middleware\JwtAdmin::class,
    ],
    //api中间件
    'api' => [
        //权限验证
        app\middleware\JwtApi::class,
    ],
];
