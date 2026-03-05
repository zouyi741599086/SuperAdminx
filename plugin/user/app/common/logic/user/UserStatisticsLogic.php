<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\model\UserModel;

/**
 * 用户统计逻辑
 */
class UserStatisticsLogic
{

    public function __construct(
        private UserTreeLogic $userTreeLogic,
    ) {}

    /**
     * 获取推广统计
     * @param int $userId 
     * @return array 直推总人数、间推总人数、团队总人数
     */
    public function getChildrenTotal(int $userId) : array
    {
        $user = UserModel::find($userId);

        $data['zt_num']   = UserModel::where('pid', $userId)->count();
        $data['jt_num']   = UserModel::where('pid_path', 'like', "%,{$userId},%")
            ->where('pid_layer', $user->pid_layer + 1)
            ->count();
        $data['team_num'] = UserModel::where('pid_path', 'like', "%,{$userId},%")
            ->count() - 1;

        return $data;
    }

    /**
     * 获取推广统计月走势图
     */
    public function getChildrenTotalMonth(int $userId, array $params = []) : array
    {
        $where = $this->userTreeLogic->getChildrenWhere($userId, $params);

        $result['x'] = [];
        $result['y'] = [];
        for ($i = 5; $i >= 0; $i--) {
            $result['x'][] = date('m', strtotime("-$i months")) . '月';
            $month         = date('Y-m', strtotime("-$i months"));
            $result['y'][] = UserModel::where($where)
                ->whereMonth('create_time', $month)
                ->count();
        }

        return $result;
    }

    /**
     * 获取推广统计日走势图
     */
    public function getChildrenTotalDate(int $userId, array $params = []) : array
    {
        $where = $this->userTreeLogic->getChildrenWhere($userId, $params);

        $result['x'] = [];
        $result['y'] = [];
        for ($i = 6; $i >= 0; $i--) {
            $result['x'][] = date('d', strtotime("-$i days"));
            $date          = date('Y-m-d', strtotime("-$i days"));
            $result['y'][] = UserModel::where($where)
                ->whereDay('create_time', $date)
                ->count();
        }

        return $result;
    }
}