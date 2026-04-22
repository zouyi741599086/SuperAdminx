<?php
/**
 * This file is part of SuperAdminx.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */

return [
    // 各种余额类型
    'balance_type' => [
        [
            'field'                => 'money', // 字段名称
            'title'                => '余额', // 字段中文
            'precision'            => 2, // 小数点保留位数
            'details'              => true, // 是否有明细记录
            'submeter_start_month' => '', // 明细是否有使用分表(按照月份分表)，分表开始的月份如2025-08，空代表没分表
            'color'                => '', // 在用户端此余额类型的主色调，留空默认为前端主色调
            'turn'                 => true, // 是否允许账户之间转账
            'withdraw'             => true, // 是否允许提现
            'details_type'         => [ // 明细类型
                'money_balance_withdraw'   => '提现',
                'money_order_create'       => '订单支付',
                'money_order_return'       => '订单退款',
                'money_turn'               => '账户转账',
                'money_lottery_zhongjiang' => '现金抽奖',
                'money_shop_order_benefit' => '分销佣金',
                'money_refund'             => '退款',
                'money_top_up'             => '充值',
                'money_other'              => '其它',
            ],
        ],
        [
            'field'                => 'integral',
            'title'                => '积分',
            'precision'            => 0,
            'details'              => true,
            'submeter_start_month' => '',
            'color'                => '#fc961a',
            'turn'                 => true,
            'withdraw'             => false,
            'details_type'         => [
                'integral_order_create'      => '兑换商品',
                'integral_order_refund'      => '兑换订单退款',
                'integral_deduction_rmb'     => '积分抵扣金额',
                'integral_deduction_rmb_run' => '商城订单退款',
                'integral_turn'              => '账户转账',
                'integral_lottery_des'       => '现金抽奖',
                'integral_sign_in'           => '签到',
                'integral_other'             => '其它',
            ],
        ],
    ],
];
