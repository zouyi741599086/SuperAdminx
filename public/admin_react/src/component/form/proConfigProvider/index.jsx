import { lazy } from 'react';
import {
    ProConfigProvider,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import Lazyload from '@/component/lazyLoad/index';

const UploadImg = lazy(() => import('@/component/form/uploadImg/index'));
const UploadImgAll = lazy(() => import('@/component/form/uploadImgAll/index'));
const UploadImgVideoAll = lazy(() => import('@/component/form/uploadImgVideoAll/index'));
const Teditor = lazy(() => import('@/component/form/teditor/index'));
const PreviewTeditor = lazy(() => import('@/component/preview/teditor/index'));
const UploadFile = lazy(() => import('@/component/form/uploadFile/index'));
const UploadFileAll = lazy(() => import('@/component/form/uploadFileAll/index'));
const TencentMap = lazy(() => import('@/component/form/tencentMap/index'));
const Province = lazy(() => import('@/component/form/province'));
const ProvinceCity = lazy(() => import('@/component/form/provinceCity'));
const ProvinceCityArea = lazy(() => import('@/component/form/provinceCityArea'));

/**
 * pro form超级表单的配置，增加自定义字段
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {

    return (<>
        <ProConfigProvider
            valueTypeMap={{
                // 上传图片
                uploadImg: {
                    render: (text) => <Image width={100} height={100} src={text} />,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><UploadImg {...props?.fieldProps} /></Lazyload>
                    ),
                },
                // 上传多图
                uploadImgAll: {
                    render: (text) => {
                        return <>
                            {text.map(item => {
                                return <Image width={100} height={100} src={text} />
                            })}
                        </>
                    },
                    renderFormItem: (text, props) => {
                        return <Lazyload height="50"><UploadImgAll {...props?.fieldProps} /></Lazyload>
                    },
                },
                // 上传多个图片或视频
                uploadImgVideoAll: {
                    render: (text) => {
                        return <>
                            {text.map(item => {
                                return <Button type="link" size="small" link={`${item.url}`}>{item.name}</Button>
                            })}
                        </>
                    },
                    renderFormItem: (text, props) => {
                        return <Lazyload height="50"><UploadImgVideoAll {...props?.fieldProps} /></Lazyload>
                    },
                },
                // 上传文件
                uploadFile: {
                    render: (text) => <Button type="link" size="small" link={`${text.url}`}>{text.name}</Button>,
                    renderFormItem: (text, props) => {
                        return <Lazyload height="50"><UploadFile {...props?.fieldProps} /></Lazyload>
                    },
                },
                // 上传多个文件
                uploadFileAll: {
                    render: (text) => {
                        return <>
                            {text.map(item => {
                                return <Button type="link" size="small" link={`${item.url}`}>{item.name}</Button>
                            })}
                        </>
                    },
                    renderFormItem: (text, props) => {
                        return <Lazyload height="50"><UploadFileAll {...props?.fieldProps} /></Lazyload>
                    },
                },
                // 编辑器
                teditor: {
                    render: (text) => <PreviewTeditor content={text} />,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><Teditor {...props?.fieldProps} /></Lazyload>
                    ),
                },
                // 腾讯地图选择经纬度
                tencentMap: {
                    render: (text) => text,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><TencentMap {...props?.fieldProps} /></Lazyload>
                    ),
                },
                // 省选择
                province: {
                    render: (text) => text,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><Province {...props?.fieldProps} /></Lazyload>
                    ),
                },
                // 省市选择
                provinceCity: {
                    render: (text) => text,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><ProvinceCity {...props?.fieldProps} /></Lazyload>
                    ),
                },
                // 省市区选择
                provinceCityArea: {
                    render: (text) => text,
                    renderFormItem: (text, props) => (
                        <Lazyload height="50"><ProvinceCityArea {...props?.fieldProps} /></Lazyload>
                    ),
                },
            }}
        >
            {props.children}
        </ProConfigProvider>
    </>
    );
};