import {
    CloudUploadOutlined,
    CloudDownloadOutlined,
    InboxOutlined
} from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { Button, App, Space, Steps, Upload } from 'antd';
import {wordTemplateApi} from '@/api/wordTemplate';
const { Dragger } = Upload;
import { getToken } from '@/common/function';
import {fileApi} from '@/api/file'
import { authCkeck } from '@/common/function';

/**
 * 批量导入数据
 * @param {tableReload} function 导入成功后刷新表格
 */
export default ({ tableReload, ...props }) => {
    const { message, modal } = App.useApp();

    //下载导入模板
    const downloadImportExcel = () => {
        message.open({
            type: 'loading',
            content: '模板生成中...',
            duration: 0,
            key: 'excel'
        });
        wordTemplateApi.downloadImportExcel().then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('模板已生成')
                setTimeout(() => {
                    window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                }, 1000)
            } else {
                message.error('模板生成失败')
            }
        })
    }

    //上传导入
    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: wordTemplateApi.importData,
        headers: {
            token: getToken()
        },
        data: {
        },
        accept: '.xlsx',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                message.open({
                    type: 'loading',
                    content: '数据导入中...',
                    duration: 0,
                    key: 'excel'
                });
            }
            if (status === 'done') {
                message.destroy('excel');
                if (info.file.response.code === 1) {
                    modal.info({
                        title: '导入成功',
                        content: <>
                            共成功导入<strong style={{ color: 'red' }}>{info.file.response.data}</strong>条数据~
                        </>,
                        onOk() { },
                    });
                    if (parseInt(info.file.response.data) > 0) {
                        tableReload();
                    }
                } else {
                    message.error(info.file.response.message);
                }
            } else if (status === 'error') {
                message.open({
                    type: 'error',
                    content: '数据导入失败',
                    duration: 2,
                    key: 'excel'
                });
            }
        },
        onDrop(e) {
        },
    };


    return (
        <ModalForm
            name="allfahuo"
            title="批量导入"
            trigger={
                <Button
                    type="primary"
                    ghost
                    icon={<CloudUploadOutlined />}
                    disabled={authCkeck('wordTemplateImport')}
                >批量导入</Button>
            }
            footer={null}
            width={500}
            submitter={false}
        >
            <Space direction='vertical' style={{ width: '100%' }}>
                <Steps
                    progressDot
                    current={2}
                    direction="vertical"
                    items={[
                        {
                            title: '下载导入模板',
                            description: <>
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<CloudDownloadOutlined />}
                                    onClick={downloadImportExcel}
                                >下载导入模板</Button>
                            </>,
                        },
                        {
                            title: '填写数据',
                            description: '按照下载的表格模板填充数据',
                        },
                        {
                            title: '上传表格，导入数据',
                            description: <>
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ fontSize: '40px' }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ fontSize: '14px' }}>单击或拖动文件到此区域进行上传</p>
                                </Dragger>
                            </>,
                        },
                    ]}
                />
            </Space>

        </ModalForm>
    );
};