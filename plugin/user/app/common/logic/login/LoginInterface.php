<?php
namespace plugin\user\app\common\logic\login;

/**
 * 登录接口
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
interface LoginInterface
{
    /**
     * 验证登录参数
     * @param array $data 登录数据
     * @return void
     * @throws \Exception 验证失败抛出异常
     */
    public function validate(array &$data) : void;

    /**
     * 检查用户是否已注册
     * @param array $data 登录数据
     * @return int|null 返回用户ID，未注册返回null
     */
    public function getRegisteredUserId(array &$data) : ?int;

}