<?php
namespace plugin\user\app\event;

use support\Log;
use plugin\user\app\common\logic\UserTotalDayLogic;

/**
 * 用户事件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class UserEvent
{
    /**
     * 用户事件
     * @param int $userId 用户id
     * @param string $event_name 事件名称
     * @return void
     */
    public function handle($userId, $event_name)
    {
        $event_name = str_replace("user.", "", $event_name);

        switch ($event_name) {
            // 后台新增或注册
            case 'create':
                // 日月统计
                UserTotalDayLogic::incCount();
                break;
        }

    }
}