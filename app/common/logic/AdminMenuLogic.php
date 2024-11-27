<?php
namespace app\common\logic;

use app\common\model\AdminMenuModel;
use app\common\validate\AdminMenuValidate;

/**
 * 后台链接权限模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminMenuLogic
{

    /**
     * 获取所有后台权限节点
     * @param array $params 参数
     */
    public static function getList(array $params)
    {
        return AdminMenuModel::withSearch(['hidden'], $params)
            ->field('*')
            ->order('sort asc,id desc')
            ->select();
    }

    /**
     * 添加权限节点
     * @param array $params 
     */
    public static function create(array $params)
    {
        try {
            validate(AdminMenuValidate::class)->check($params);

            $result = AdminMenuModel::create($params);
            //找出我的路劲
            if (isset($params['pid_name']) && $params['pid_name']) {
                $pid_name_path = AdminMenuModel::where('name', $params['pid_name'])->value('pid_name_path');
                $pid_name_path = "{$pid_name_path}{$result->name},";
            } else {
                $pid_name_path = ",{$result->name},";
            }
            //更新路劲
            AdminMenuModel::update([
                'id'            => $result->id,
                'pid_name_path' => $pid_name_path
            ]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 修改权限节点
     * @param array $params
     */
    public static function update(array $params)
    {
        //由于前段form会把字段等于null的干掉，所以这要特别加上
        if (! isset($params['pid_name']) || ! $params['pid_name']) {
            $params['pid_name'] = null;
        }
        try {
            validate(AdminMenuValidate::class)->check($params);

            //原来旧的name
            $oldName = AdminMenuModel::where('id', $params['id'])->value('name');

            AdminMenuModel::update($params);
            AdminMenuModel::where('pid_name', $oldName)->update([
                'pid_name' => $params['name'],
            ]);

            //重新更新我下面所有数据的pid_path相关字段
            $list = AdminMenuModel::where('pid_name_path', 'like', "%,{$oldName},%")
                ->orderRaw("CHAR_LENGTH(pid_name_path) asc")
                ->field('id,name,pid_name,pid_name_path')
                ->select()
                ->toArray();
            foreach ($list as $k => $v) {
                if ($v['pid_name']) {
                    $pid_data      = AdminMenuModel::where('name', $v['pid_name'])->field('id,pid_name_path')->find();
                    $v['pid_name_path'] = "{$pid_data['pid_name_path']}{$v['name']},";
                } else {
                    $v['pid_name_path'] = ",{$v['name']},";
                }
                AdminMenuModel::update($v);
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        return AdminMenuModel::find($id);
    }

    /**
     * 删除权限节点
     * @param array $ids
     */
    public static function delete(array $ids)
    {
        foreach ($ids as $id) {
            //不能删除50》参数设置，configLogic的增删除改里面要用此id同步到adminMenu表
            if (! in_array($id, [50])) {
                AdminMenuModel::destroy($id);
            }
        }
    }
}