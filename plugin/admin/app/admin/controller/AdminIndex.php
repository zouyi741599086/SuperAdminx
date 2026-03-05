<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;

/**
 * 管理用户
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminIndex
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
    ) {}

    /**
     * @log 删除所有缓存
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function clearCache(Request $request) : Response
    {
        $cacheType = config('cache.default');

        // 文件缓存
        if ($cacheType == 'file') {
            $dir = runtime_path('cache');
            if (is_dir($dir)) {
                remove_dir($dir);
            }
        }

        // redis缓存
        if ($cacheType == 'redis') {
            $redisConnection = config('cache.stores.redis.connection');
            $redisConfig     = config("redis.{$redisConnection}");

            $redis = new \Redis();
            $redis->connect(
                $redisConfig['host'] ?? '127.0.0.1',
                $redisConfig['port'] ?? 6379,
                $redisConfig['timeout'] ?? 2.0
            );

            if (isset($redisConfig['password']) && $redisConfig['password']) {
                $redis->auth($redisConfig['password']);
            }

            if (isset($redisConfig['database'])) {
                $redis->select($redisConfig['database']);
            }

            $redis->flushDB();
            $redis->close();
        }
        
        return success([]);
    }

}
