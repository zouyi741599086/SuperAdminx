<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

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