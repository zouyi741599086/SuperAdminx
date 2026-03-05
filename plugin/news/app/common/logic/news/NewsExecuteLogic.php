<?php
namespace plugin\news\app\common\logic\news;

use plugin\news\app\common\model\NewsModel;
use plugin\news\app\common\validate\NewsValidate;

/**
 * 文章
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsExecuteLogic
{

    /**
     * 添加文章
     * @param array $data
     */
    public function create(array $data)
    {
        try {
            think_validate(NewsValidate::class)->check($data);
            NewsModel::create($data);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改文章
     * @param array $data
     */
    public function update(array $data)
    {
        try {
            think_validate(NewsValidate::class)->check($data);
            NewsModel::update($data);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除文章
     * @param array|int $id
     */
    public function delete(array|int $id)
    {
        NewsModel::destroy($id);
    }

    /**
     * 上下架修改
     * @param array $data
     *  - id 文章id
     *  - status 状态 1：上架 2：下架
     */
    public function updateStatus(array $data)
    {
        if (! $data['id'] || ! $data['status']) {
            abort('参数错误');
        }
        try {
            NewsModel::update([
                'id'     => $data['id'],
                'status' => $data['status'],
            ]);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 批量操作文章，切换分类或复制文章
     * @param array $params
     */
    public function updateAll(array $params)
    {
        $ids           = $params['ids'] ?? null;
        $type          = $params['type'] ?? null;
        $news_class_id = $params['news_class_id'] ?? null;

        if (! $ids || ! $type || ! $news_class_id) {
            abort('参数错误');
        }
        // 1》切换分类
        if ($type == 1) {
            NewsModel::whereIn('id', $ids)->update([
                'news_class_id' => $news_class_id,
            ]);
        }
        // 2》复制文章
        if ($type == 2) {
            $list = NewsModel::whereIn('id', $ids)
                ->withoutField('id,creaet_time,update_time,pv')
                ->select()
                ->toArray();
            foreach ($list as $k => &$v) {
                $v['news_class_id'] = $news_class_id;
            }
            (new NewsModel())->saveAll($list);
        }
    }

    /**
     * 更改排序
     * @param array $params
     * */
    public function updateSort(array $params)
    {
        $updateData = [];
        foreach ($params as $k => $v) {
            $updateData[] = [
                'id'   => $v['id'],
                'sort' => intval($v['sort']),
            ];
        }
        (new NewsModel())->saveAll($updateData);
    }

    /**
     * 增加浏览量
     * @param int $id
     */
    public function incPv(int $id)
    {
        NewsModel::where('id', $id)->inc('pv')->update();
    }

}