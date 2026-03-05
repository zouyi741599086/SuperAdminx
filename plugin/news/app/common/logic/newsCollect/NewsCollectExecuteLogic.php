<?php
namespace plugin\news\app\common\logic\newsCollect;

use plugin\news\app\common\model\NewsCollectModel;

/**
 * 收藏文章 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsCollectExecuteLogic
{

    /**
     * 收藏/取消收藏
     * @param int $userId
     * @param int $newsId
     */
    public function change(int $userId, int $newsId)
    {
        // 判断是否有收藏
        $id = NewsCollectModel::where([
            ['user_id', '=', $userId],
            ['news_id', '=', $newsId],
        ])->value('id');
        if ($id) {
            NewsCollectModel::destroy($id);
            return false;
        }

        NewsCollectModel::create([
            'user_id' => $userId,
            'news_id' => $newsId,
        ]);
        return true;
    }

    /**
     * 删除
     * @param int $id 要删除的id
     * @param int $userId 用户id
     */
    public function delete(int $id, int $userId)
    {
        NewsCollectModel::where([
            ['id', '=', $id],
            ['user_id', '=', $userId],
        ])->delete();
    }

    /**
     * 清除所有收藏
     * @param int $userId 用户id
     */
    public function clear(int $userId)
    {
        NewsCollectModel::where('user_id', $userId)->delete();
    }
}