<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminLog\{ AdminLogQueryLogic} ;

/**
 * 操作日志
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLogService
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private AdminLogQueryLogic $adminLogQueryLogic,
    ) {}

    /**
     * 获取列表
     */
    public function getList(array $params)
    {
        return $this->adminLogQueryLogic->getList($params);
    }

}
