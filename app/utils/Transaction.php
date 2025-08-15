<?php
namespace app\utils;

use support\Log;
use support\think\Db;

/**
 * 多数据库事务
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class Transaction
{
    /**
     * 运行事务
     *
     * @param array $connections 需要进行事务处理的数据库连接名称
     * @param callable $callback 事务处理回调函数
     * @return mixed
     */
    public static function run(array $connections, callable $callback)
    {
        return self::multiDbTransaction($connections, $callback);
    }

    private static function multiDbTransaction(array $connections, callable $callback)
    {
        // 确保总是包含默认连接
        $allConnections = array_unique(array_merge(['default'], $connections));
        $connectionsMap = [];

        try {
            // 1. 开启所有事务
            foreach ($allConnections as $name) {
                $conn = ($name === 'default') ? Db::connect() : Db::connect($name);
                $conn->startTrans();
                $connectionsMap[$name] = $conn;
            }

            // 2. 执行业务代码
            $result = $callback();

            // 3. 提交所有事务
            foreach ($connectionsMap as $conn) {
                $conn->commit();
            }

            return $result;
        } catch (\Throwable $e) {
            // 4. 回滚所有事务（逆序回滚）
            $reverseConnections = array_reverse($connectionsMap);
            foreach ($reverseConnections as $conn) {
                try {
                    $conn->rollback();
                } catch (\Throwable $rollbackEx) {
                    // 记录回滚异常但不中断
                    Log::error("事务回滚失败: " . $rollbackEx->getMessage());
                }
            }

            throw $e; // 重新抛出原始异常
        }
    }
}