<?php
namespace plugin\news\app\common\logic\newsClass;

use plugin\news\app\common\model\NewsClassModel;

/**
 * 文章分类
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClassQueryLogic
{

    /**
     * 获取所有分类
     * @param array $params get参数
     * */
    public function getList(array $params = [])
    {
        return NewsClassModel::withSearch(
            ['static'],
            $params,
            true,
        )
            ->order('sort desc,id desc')
            ->select();
    }

    /**
     * 获取下级列表
     * @param int $id
     * */
    public function getChildrenList(int $id)
    {
        return NewsClassModel::order('sort desc,id desc')
            ->where('pid', $id)
            ->where('status', 1)
            ->select();
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return NewsClassModel::find($id);
    }

}