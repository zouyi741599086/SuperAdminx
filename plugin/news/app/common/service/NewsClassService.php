<?php
namespace plugin\news\app\common\service;

use plugin\news\app\common\logic\newsClass\{NewsClassExecuteLogic, NewsClassQueryLogic};

/**
 * 文章分类
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClassService
{
    public function __construct(
        private NewsClassExecuteLogic $newsClassExecuteLogic,
        private NewsClassQueryLogic $newsClassQueryLogic,
    ) {}

    /**
     * 获取所有分类
     * @param bool $filter 是否前端在调用
     * */
    public function getList()
    {
        $params['status'] = 1;
        return $this->newsClassQueryLogic->getList($params);
    }

    /**
     * 获取下级列表
     * @param int $id
     * */
    public function getChildrenList(int $id)
    {
        return $this->newsClassQueryLogic->getChildrenList($id);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return $this->newsClassQueryLogic->findData($id);
    }

    /**
     * 添加
     * @param array $params
     */
    public function create(array $params)
    {
        $this->newsClassExecuteLogic->create($params);
    }

    /**
     * 修改文章分类
     * @param array $params
     */
    public function update(array $params)
    {
        $this->newsClassExecuteLogic->update($params);
    }

    /**
     * 状态修改
     * @param array $params
     */
    public function updateStatus(array $params)
    {
        $this->newsClassExecuteLogic->updateStatus($params);
    }

    /**
     * 删除文章分类，同时要删除下级分类及文章
     * @param int $id
     */
    public function delete(int $id)
    {
        $this->newsClassExecuteLogic->delete($id);
    }

    /**
     * 更改排序
     * @param array $params
     * */
    public function updateSort(array $params)
    {
        $this->newsClassExecuteLogic->updateSort($params);
    }
}