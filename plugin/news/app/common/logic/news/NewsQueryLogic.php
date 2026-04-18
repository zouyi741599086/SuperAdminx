<?php
namespace plugin\news\app\common\logic\news;

use plugin\news\app\common\model\NewsModel;

/**
 * 文章
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsQueryLogic
{

    /**
     * 获取列表
     * @param array $params get参数
     * @param array $with 是否需要关联数据
     * */
    public function getList(array $params = [], array $with = [])
    {
        return NewsModel::withSearch(
            ['title', 'status', 'news_class_id', 'create_time'],
            $params,
            true,
        )
            ->with($with)
            ->withoutField('content')
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "sort desc,id desc";
                $query->order(get_admin_order_by($orderBy, $params));
            })
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id 数据id
     */
    public function findData(int $id)
    {
        return NewsModel::find($id);
    }
}