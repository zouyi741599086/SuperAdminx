import { PageContainer } from '@ant-design/pro-components';
import { adminLogApi } from '@/api/adminLog';
import { ProTable } from '@ant-design/pro-components';

/**
 * 操作日志
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    //表格列
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'tel',
        },
        {
            title: '操作内容',
            dataIndex: 'title',
        },
        {
            title: '操作时间',
            dataIndex: 'create_time',
            //定义搜索框为日期区间
            valueType: 'dateRange',
            render: (_, render) => render.create_time,
        },
    ];
    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '操作日志',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 800
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'systemLog',
                        persistenceType: 'localStorage'
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        //支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    request={async (params = {}, sort, filter) => {
                        const result = await adminLogApi.getList({
                            ...params,//包含了翻页参数跟搜索参数
                            page: params.current,
                        });
                        return {
                            data: result.data.data,
                            success: true,
                            total: result.data.total,
                        };
                    }}
                />
            </PageContainer>
        </>
    )
}
