<?php
namespace app\common\logic;

use app\common\model\NewsModel;
use app\common\validate\NewsValidate;

/**
 * 文章
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsLogic
{

    /**
     * 获取列表
     * @param array $params get参数
     * @param array $with 是否需要关联数据
     * @param boolean $filter 是否是前端在调用，需要过滤掉不应该显示的，如下架的
     * */
    public static function getList(array $params = [], array $with = ['newsClass'], bool $filter = false)
    {
        //排序
        $orderBy = "sort desc,id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        return NewsModel::withSearch(['title', 'status', 'news_class_id', 'create_time'], $params)
            ->with($with)
            ->withoutField('content')
            ->where($filter ? 'status = 1' : [])
            ->order($orderBy)
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id 数据id
     * @param boolean $filter 前端是否过滤数据，如下架的
     */
    public static function findData(int $id, bool $filter = false)
    {
        $data = NewsModel::find($id);
        if ($filter && $data['status'] == 2) {
            abort('数据不存在');
        }
        return $data;
    }

    /**
     * 添加文章
     * @param array $data
     */
    public static function create(array $data)
    {
        try {
            validate(NewsValidate::class)->check($data);
            NewsModel::create($data);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改文章
     * @param array $data
     */
    public static function update(array $data)
    {
        try {
            validate(NewsValidate::class)->check($data);
            NewsModel::update($data);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除文章
     * @param array|int $id
     */
    public static function delete(array|int $id)
    {
        NewsModel::destroy($id);
    }

    /**
     * 上下架修改
     * @param array $data
     */
    public static function updateStatus(array $data)
    {
        try {
            if (! $data['id'] || ! $data['status']) {
                abort('参数错误');
            }
            NewsModel::update([
                'id'     => $data['id'],
                'status' => $data['status']
            ]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 批量操作文章，切换分类或复制文章
     * @param array $params
     */
    public static function updateAll(array $params)
    {
        $ids           = $params['ids'] ?? null;
        $type          = $params['type'] ?? null;
        $news_class_id = $params['news_class_id'] ?? null;

        if (! $ids || ! $type || ! $news_class_id) {
            abort('参数错误');
        }
        //1》切换分类
        if ($type == 1) {
            NewsModel::whereIn('id', $ids)->update([
                'news_class_id' => $news_class_id
            ]);
        }
        //2》复制文章
        if ($type == 2) {
            $list = NewsModel::whereIn('id', $ids)->withoutField('id,creaet_time,update_time,pv')->select()->toArray();
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
    public static function updateSort(array $params)
    {
        foreach ($params as $k => $v) {
            NewsModel::update([
                'id'   => $v['id'],
                'sort' => $v['sort']
            ]);
        }
    }


    /**
     * 增加浏览量
     * @param int $id
     */
    public static function incPv(int $id)
    {
        NewsModel::where('id', $id)->inc('pv')->update();
    }
}