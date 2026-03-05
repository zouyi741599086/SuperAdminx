<?php
namespace plugin\news\app\common\service;

use plugin\news\app\common\logic\news\{NewsExecuteLogic, NewsQueryLogic};

/**
 * 文章
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsService
{

    public function __construct(
        private NewsExecuteLogic $newsExecuteLogic,
        private NewsQueryLogic $newsQueryLogic,
    ) {}

    /**
     * 获取列表
     * @param array $params get参数
     * @param array $with 是否需要关联数据
     * */
    public function getList(array $params = [], array $with = [])
    {
        return $this->newsQueryLogic->getList($params, $with);
    }

    /**
     * 获取一条数据
     * @param int $id 数据id
     */
    public function findData(int $id)
    {
        return $this->newsQueryLogic->findData($id);
    }

    /**
     * 添加文章
     * @param array $data
     */
    public function create(array $data)
    {
        $this->newsExecuteLogic->create($data);
    }

    /**
     * 修改文章
     * @param array $data
     */
    public function update(array $data)
    {
        $this->newsExecuteLogic->update($data);
    }

    /**
     * 删除文章
     * @param array|int $id
     */
    public function delete(array|int $id)
    {
        $this->newsExecuteLogic->delete($id);
    }

    /**
     * 状态修改
     * @param array $data
     */
    public function updateStatus(array $data)
    {
        $this->newsExecuteLogic->updateStatus($data);
    }

    /**
     * 批量操作文章，切换分类或复制文章
     * @param array $params
     */
    public function updateAll(array $params)
    {
        $this->newsExecuteLogic->updateAll($params);
    }

    /**
     * 更改排序
     * @param array $params
     * */
    public function updateSort(array $params)
    {
        $this->newsExecuteLogic->updateSort($params);
    }

    /**
     * 增加浏览量
     * @param int $id
     */
    public function incPv(int $id)
    {
        $this->newsExecuteLogic->incPv($id);
    }
}