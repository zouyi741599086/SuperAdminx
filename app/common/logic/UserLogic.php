<?php
namespace app\common\logic;

use app\common\model\UserModel;
use app\common\validate\UserValidate;
use think\facade\Db;

/**
 * 用户 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class UserLogic
{

    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页
     * @param bool $model 是否返回模型
     * */
    public static function getList(array $params = [], bool $page = true, bool $model = false)
    {
        // 排序
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = UserModel::withSearch(['name', 'tel', 'status', 'pid', 'create_time'], $params)
            //->withoutField('')
            ->with(['PUser' => function ($query)
            {
                $query->field('id,img,name,tel');
            }])
            ->order($orderBy);

        if ($model) {
            return $list;
        }
        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list->select();
    }

    /**
     * 获取数据
     * @param int $id 数据id
     */
    public static function findData(int $id)
    {
        return UserModel::find($id)->hidden(['password']);
    }

    /**
     * 更新
     * @param array $params
     */
    public static function update(array $params)
    {
        Db::startTrans();
        try {
            validate(UserValidate::class)->check($params);

            // 如果前端没传上级，则更新为null
            if (! isset($params['pid'])) {
                $params['pid'] = null;
            }
            // 如果有上级，则上级不能是自己，也不能是自己下面的人
            if (isset($params['pid']) && $params['pid']) {
                if ($params['pid'] == $params['id']) {
                    abort('上级不能选择自己');
                }
                if (
                    UserModel::where('pid_path', 'like', "%,{$params['id']},%")
                        ->where('id', '<>', $params['id'])
                        ->where('id', $params['pid'])
                        ->value('id')
                ) {
                    abort('上级不能选择自己下面的用户');
                }
            }

            UserModel::update($params);
            // 跟新上级路劲
            self::updatePidPath($params['id']);

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 添加修改共用，维护数据的pid_path字段
     * @param int $id
     */
    private static function updatePidPath(int $id)
    {
        // 更新我的下级
        UserModel::where('pid_path', 'like', "%,{$id},%")
            ->order("pid_layer asc")
            ->field('id,pid,pid_path,pid_layer')
            ->select()
            ->each(function ($item)
            {
                if ($item['pid']) {
                    $pidUser         = UserModel::field('id,pid,pid_path,pid_layer')->find($item['pid']);
                    $item->pid_path  = "{$pidUser->pid_path}{$item->id},";
                    $item->pid_layer = $pidUser->pid_layer + 1;
                } else {
                    $item->pid_path  = ",{$item->id},";
                    $item->pid_layer = 1;
                }
                $item->save();
            });
    }

    /**
     * 搜索选择某条数据
     * @param string $keywords 
     * @param int $id
     */
    public static function selectUser(?string $keywords, ?int $id)
    {
        $where = [];
        // 搜索
        $keywords != null && $where[] = ['name|tel', 'like', "%{$keywords}%"];
        $id != null && $where[] = ['id', '=', $id];

        return UserModel::field('id,name,tel')
            ->where($where)
            ->order('id desc')
            ->limit(20)
            ->select();
    }

    /**
     * 查询推广关系
     * @param array $params 
     */
    public static function invitations(array $params)
    {
        $where = [];
        // 第一次搜索的时候
        if (isset($params['tel']) && $params['tel']) {
            $where[] = ['tel', '=', $params['tel']];
        }

        // 搜索下级的时候
        if (isset($params['pid']) && $params['pid']) {
            $where[] = ['pid', '=', $params['pid']];
        }

        $list = UserModel::where($where)
            ->field('id,name,tel,pid')
            ->withCount('NextUser')
            ->order('id desc')
            ->select();

        return $list;
    }

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     */
    public static function exportData(array $params)
    {
        try {
            // 表格头
            $header = ['姓名', '手机号', '状态', '上级用户', '注册时间'];

            $list    = self::getList($params, true, true)->cursor();
            $tmpList = [];
            foreach ($list as $v) {
                // 导出的数据
                $tmpList[] = [
                    $v['name'] ?? '',
                    $v['tel'] ?? '',
                    $v['status'] == 1 ? '正常' : '禁用',
                    $v['pid'] ? "{$v['PUser']['name']}/{$v['PUser']['tel']}" : '--',
                    $v['create_time'] ?? '',
                ];
            }
            // 开始生成表格导出
            $config   = [
                'path' => public_path() . '/tmp_file',
            ];
            $fileName = "用户.xlsx";
            $excel    = new \Vtiful\Kernel\Excel($config);
            $filePath = $excel->fileName(rand(1, 10000) . time() . '.xlsx')
                ->header($header)
                ->data($tmpList)
                ->output();
            $excel->close();

            return [
                'filePath' => str_replace(public_path(), '', $filePath),
                'fileName' => $fileName
            ];
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

}