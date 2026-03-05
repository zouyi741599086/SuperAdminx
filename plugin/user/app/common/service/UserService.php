<?php
namespace plugin\user\app\common\service;

use plugin\user\app\common\logic\user\{UserExecuteLogic, UserExportLogic, UpdateUserInfoLogic, UserQueryLogic, UserStatisticsLogic, UserTreeLogic, SmsLogic, UserShareQrcodeLogic, UserSharePosterLogic};

/**
 * 用户服务
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class UserService
{
    public function __construct(
        private UserExecuteLogic $userExecuteLogic,
        private UpdateUserInfoLogic $updateUserInfoLogic,
        private UserQueryLogic $userQueryLogic,
        private UserTreeLogic $userTreeLogic,
        private UserExportLogic $userExportLogic,
        private UserStatisticsLogic $userStatisticsLogic,
        private SmsLogic $smsLogic,
        private UserShareQrcodeLogic $userShareQrcodeLogic,
        private UserSharePosterLogic $userSharePosterLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        return $this->userQueryLogic->getList($params, $page);
    }

    /**
     * 新增用户
     * @param array $params 
     * @return void
     */
    public function create(array $params) : void
    {
        $this->userExecuteLogic->create($params);
    }

    /**
     * 获取数据
     * @param int $id 数据id
     */
    public function findData(int $id)
    {
        return $this->userQueryLogic->findData($id);
    }

    /**
     * 更新
     * @param array $params
     * @return void
     */
    public function update(array $params) : void
    {
        $this->userExecuteLogic->update($params);
    }

    /**
     * 用户状态修改
     * @param int|array $id
     * @param int $status
     * @return void
     */
    public function updateStatus(int|array $id, int $status) : void
    {
        $this->userExecuteLogic->updateStatus($id, $status);
    }

    /**
     * 搜索选择某条数据
     * @param array $params
     */
    public function selectUser(array $params)
    {
        return $this->userQueryLogic->selectUser($params);
    }

    /**
     * 查询推广关系
     * @param array $params 
     *  - id 用户id
     *  - pid 上级id
     */
    public function invitations(array $params)
    {
        return $this->userTreeLogic->invitations($params);
    }

    /**
     * 更改手机号获取验证码
     * @param string $tel 新手机号
     */
    public function getUpdateTelCode(string $tel)
    {
        $this->smsLogic->sendCode($tel);
    }

    /**
     * 用户修改自己的资料
     * @method post
     * @param array $params
     * @param int $userId
     * @return void
     */
    public function updateInfo(array $params, int $userId) : void
    {
        $this->updateUserInfoLogic->updateInfo($params, $userId);
    }

    /**
     * 搜索某个用户，不能搜索自己
     * @param int $userId 自己用户id
     * @param string $tel 手机号
     */
    public function searchUser(int $userId, string $tel)
    {
        return $this->userQueryLogic->searchUser($userId, $tel);
    }

    /**
     * 获取推广统计
     * @param int $userId 用户id
     * @return array 推广统计数据
     */
    public function getChildrenTotal(int $userId) : array
    {
        return $this->userStatisticsLogic->getChildrenTotal($userId);
    }

    /**
     * 获取推广统计 月走势图
     * @param int $userId 用户id
     * @param array $params 参数
     *  - layer 层级，1》直推，2》简推，以此类推， 空为获取所有下级
     * @return array 推广统计数据
     */
    public function getChildrenTotalMonth(int $userId, array $params = []) : array
    {
        return $this->userStatisticsLogic->getChildrenTotalMonth($userId, $params);
    }

    /**
     * 获取推广统计 日走势图
     * @param int $userId 用户id
     * @param array $params 参数
     *  - layer 层级，1》直推，2》简推，以此类推， 空为获取所有下级
     * @return array 推广统计数据
     */
    public function getChildrenTotalDate(int $userId, array $params = []) : array
    {
        return $this->userStatisticsLogic->getChildrenTotalDate($userId, $params);
    }

    /**
     * 获取推广列表，就是或下级列表
     * @param int $userId 用户id
     * @param array $params 参数
     *  - layer 层级，1》直推，2》简推，以此类推， 空为获取所有下级
     *  - keywords 搜索关键字
     * @return mixed 直推列表 或 间推列表 或 3级推广列表 或 4级推广列表 或 ... 或 团队总列表
     */
    public function getChildrenList(int $userId, array $params = [])
    {
        return $this->userTreeLogic->getChildrenList($userId, $params);
    }

    /**
     * 获取用户的所有的上级
     * @param int $userId 用户id
     * @param bool $isMe 是否包含自己
     * @return array 真实的上级用户
     */
    public function getPidUser(int $userId, bool $isMe = false) : array
    {
        return $this->userTreeLogic->getPidUser($userId, $isMe);
    }

    /**
     * 获取用户推广的二维码
     * @param int $userId 用户id
     * @return string 二维码图片地址
     */
    public function getShareQrcode(int $userId, bool $isMe = false) : string
    {
        return $this->userShareQrcodeLogic->getQrcode($userId, $isMe);
    }

    /**
     * 获取推广海报
     * @method post
     * @param int $userId 用户id
     * @param string $appName app名称
     */
    public function getSharePoster(int $userId, string $appName)
    {
        return $this->userSharePosterLogic->getPoster($userId, $appName);
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params)
    {
        return $this->userExportLogic->exportData($params);
    }
}