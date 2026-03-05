<?php
namespace plugin\balance\app\common\logic\balance;

use plugin\balance\app\common\logic\balance\BalanceQueryLogic;
use support\think\Db;

/**
 * 导出用户余额
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceExportLogic
{

    public function __construct(
        private BalanceQueryLogic $balanceQueryLogic,
    ) {}

    /**
     * 导出数据
     * @param array $params get参数，用于导出数据的控制
     * @return array
     */
    public function exportData(array $params): array
    {
        try {
            $balanceTypeList = config('plugin.balance.superadminx.balance_type', 'array');
            $tmpList         = [];
            $this->balanceQueryLogic->getList($params, page: false)
                ->chunk(1000, function ($list) use (&$tmpList, &$balanceTypeList)
                {
                    foreach ($list as $v) {
                        // 导出的数据
                        $tmp = [
                            $v->user_id,
                            $v->User->name ?? '--',
                            $v->User->tel ?? '--',
                        ];

                        // 防止余额类型的顺序跟数据库的对不上
                        foreach ($balanceTypeList as $val) {
                            $tmp[] = $v[$val['field']] ?? 0;
                        }

                        $tmpList[] = $tmp;
                    }
                });

            // 表格头
            $header = array_merge(
                ['用户ID', '用户昵称', '用户手机号'],
                array_column($balanceTypeList, 'title'),
            );
            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "用户余额.xlsx",
            ];
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }
}