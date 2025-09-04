<?php

return [ 
    //全局中间件
    ''        => [
        //跨域
        app\middleware\AccessControl::class,
        //请求数据解密
        app\middleware\RequestDecrypt::class,
    ],
    //后台管理中间件
    'admin'   => [
        //权限验证
        app\middleware\JwtAdmin::class,
    ],
    //api中间件
    'api' => [
        //权限验证
        app\middleware\JwtApi::class,
    ]
];
