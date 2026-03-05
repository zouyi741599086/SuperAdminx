<?php
namespace plugin\news\app\common\service;

use plugin\news\app\common\logic\newsCollect\{NewsCollectExecuteLogic, NewsCollectQueryLogic};

/**
 * 收藏文章 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsCollectService
{
    public function __construct(
        private NewsCollectExecuteLogic $newsCollectExecuteLogic,
        private NewsCollectQueryLogic $newsCollectQueryLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页则返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        return $this->newsCollectQueryLogic->getList($params, $page);
    }

    /**
     * 收藏/取消收藏
     * @param int $userId
     * @param int $newsId
     * @return bool
     */
    public function change(int $userId, int $newsId): bool
    {
        return $this->newsCollectExecuteLogic->change($userId, $newsId);
    }

    /**
     * 删除
     * @param int $id 要删除的id
     * @param int $userId 用户id
     */
    public function delete(int $id, int $userId)
    {
        $this->newsCollectExecuteLogic->delete($id, $userId);
    }

    /**
     * 清除所有收藏
     * @param int $userId 用户id
     */
    public function clear(int $userId)
    {
        $this->newsCollectExecuteLogic->clear($userId);
    }

    /**
     * 获取收藏的总数
     * @param int $userId 用户id
     * @return int
     */
    public function getCount(int $userId) : int
    {
        return $this->newsCollectQueryLogic->getCount($userId);
    }

    /**
     * 判断用户是否收藏了此文章
     * @param int $newsId 文章id
     * @param int $userId 用户id
     * @return bool
     */
    public function isCollect(int $newsId, ?int $userId = null) : bool
    {
        return $this->newsCollectQueryLogic->isCollect($newsId, $userId);
    }

}