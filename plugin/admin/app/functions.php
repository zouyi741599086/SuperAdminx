<?php

use plugin\admin\app\common\logic\ConfigLogic;

/**
 * Here is your custom functions.
 */

/**
 * 获取设置
 * @param string $name
 * @param string $resultType object|array
 * @throws \Exception
 * @return array
 */
function get_config(string $name, string $resultType = 'object') : array
{
    return ConfigLogic::getConfig($name, $resultType);
}
