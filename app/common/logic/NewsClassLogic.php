<?php
namespace app\common\logic;

use Shopwwi\LaravelCache\Cache;
use think\facade\Db;
use app\common\model\NewsClassModel;
use app\common\model\NewsModel;
use app\common\validate\NewsClassValidate;

/**
 * 文章分类
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClassLogic
{

    /**
     * 获取列表
     * */
    public static function getList()
    {
        return Cache::rememberForever('NewsClass', function ()
        {
            return NewsClassModel::order('sort desc,id desc')
                ->select()
                ->toArray();
        });
    }

    /**
     * 获取下级列表
     * @param int $id
     * */
    public static function getNextList(int $id)
    {
        return NewsClassModel::order('sort desc,id desc')
            ->where('pid', $id)
            ->select();
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        return Cache::rememberForever("NewsClass{$id}", function () use ($id)
        {
            return NewsClassModel::find($id);
        });
    }

    /**
     * 添加
     * @param array $params
     */
    public static function create(array $params)
    {
        Db::startTrans();
        try {
            validate(NewsClassValidate::class)->check($params);
            $result = NewsClassModel::create($params);

            //找出我的路劲
            if (isset($params['pid']) && $params['pid']) {
                $pid_path = NewsClassModel::where('id', $params['pid'])->value('pid_path');
                $pid_path = "{$pid_path}{$result->id},";
            } else {
                $pid_path = ",{$result->id},";
            }
            //更新路劲
            NewsClassModel::update([
                'id'       => $result->id,
                'pid_path' => $pid_path,
            ]);
            Cache::forget("NewsClass");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改文章分类
     * @param array $params
     */
    public static function update(array $params)
    {
        Db::startTrans();
        try {
            validate(NewsClassValidate::class)->check($params);
            //由于前段form会把字段等于null的干掉，所以这要特别加上
            if (! isset($params['pid']) || ! $params['pid']) {
                $params['pid'] = null;
            }
            NewsClassModel::update($params);

            //重新更新我下面所有数据的pid_path相关字段
            $update_list = NewsClassModel::where('pid_path', 'like', "%,{$params['id']},%")
                ->orderRaw("CHAR_LENGTH(pid_path) asc")
                ->field('id,title,pid,pid_path')
                ->select()
                ->toArray();
            foreach ($update_list as $k => $v) {
                if ($v['pid']) {
                    $pid_data      = NewsClassModel::field('id,pid,pid_path')->find($v['pid']);
                    $v['pid_path'] = "{$pid_data['pid_path']}{$v['id']},";
                } else {
                    $v['pid_path'] = ",{$v['id']},";
                }
                NewsClassModel::update($v);
            }

            Cache::forget("NewsClass");
            Cache::forget("NewsClass{$params['id']}");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 上下架修改
     * @param array $params
     */
    public static function updateStatus(array $params)
    {
        Db::startTrans();
        try {
            if (! $params['id'] || ! $params['status']) {
                abort('参数错误');
            }
            NewsClassModel::update([
                'id'     => $params['id'],
                'status' => $params['status']
            ]);
            Cache::forget("NewsClass");
            Cache::forget("NewsClass{$params['id']}");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 删除文章分类，同时要删除下级分类及文章
     * @param int $id
     */
    public static function delete(int $id)
    {
        Db::startTrans();
        try {
            $ids = NewsClassModel::where('pid_path', 'like', "%,{$id},%")->whereOr('id', $id)->column('id');
            //删除文章
            NewsModel::destroy(function ($query) use ($ids)
            {
                $query->where('news_class_id', 'in', $ids);
            });
            //删除分类
            NewsClassModel::destroy($ids);
            //删除缓存
            Cache::forget("NewsClass");
            Cache::forget("NewsClass{$id}");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 更改排序
     * @param array $params
     * */
    public static function updateSort(array $params)
    {
        Db::startTrans();
        try {
            foreach ($params as $k => $v) {
                NewsClassModel::update([
                    'id'   => $v['id'],
                    'sort' => $v['sort']
                ]);
            }
            Cache::forget("NewsClass");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}