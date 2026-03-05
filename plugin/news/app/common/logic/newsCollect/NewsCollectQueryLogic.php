<?php
namespace plugin\news\app\common\logic\newsCollect;

use plugin\news\app\common\model\NewsCollectModel;

/**
 * 收藏文章 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsCollectQueryLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页则返回模型
     * */
    public function getList(array $params = [], bool $page = true)
    {
        $list = NewsCollectModel::withSearch(
            ['user_id', 'news_id'],
            $params,
            true,
        )
            ->with([
                'News' => function ($query)
                {
                    $query->field('id,title,img,description,create_time');
                }
            ])
            ->when(true, function ($query) use ($params)
            {
                $orderBy = "id desc";
                $query->order(get_admin_order_by($orderBy, $params));
            });

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

    /**
     * 获取收藏的总数
     * @param int $userId 用户id
     * @return int
     */
    public function getCount(int $userId) : int
    {
        return NewsCollectModel::where('user_id', $userId)
            ->count();
    }

    /**
     * 判断用户是否收藏了此文章
     * @param int $newsId 文章id
     * @param int $userId 用户id
     * @return bool
     */
    public function isCollect(int $newsId, ?int $userId = null) : bool
    {
        if (! $userId) {
            return false;
        }
        return NewsCollectModel::where([
            ['user_id', '=', $userId],
            ['news_id', '=', $newsId],
        ])
            ->value('id') ? true : false;
    }

}