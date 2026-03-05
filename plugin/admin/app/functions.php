<?php

use plugin\admin\app\common\logic\config\ConfigQueryLogic;
use app\utils\ArrayObjectAccessUtils;

/**
 * Here is your custom functions.
 */

/**
 * 获取设置
 * @param string $name
 * @param string $resultType object|array
 * @throws \Exception
 * @return array|ArrayObjectAccessUtils
 */
function get_config(string $name, string $resultType = 'object') : array|ArrayObjectAccessUtils
{
    return (new ConfigQueryLogic())->getConfig($name, $resultType);
}
