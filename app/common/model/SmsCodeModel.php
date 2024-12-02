<?php
namespace app\common\model;

/**
 * 验证码
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class SmsCodeModel extends BaseModel
{
    // 表名
    protected $name = "sms_code";

    // 是否自动完成字段
    protected $updateTime = false;

}