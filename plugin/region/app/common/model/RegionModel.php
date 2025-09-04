<?php
namespace plugin\region\app\common\model;

use app\common\model\BaseModel;

/**
 * 省市区
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class RegionModel extends BaseModel
{
    // 表名
    protected $name = 'region';

    // 是否自动完成字段
    protected $autoWriteTimestamp = false;

}