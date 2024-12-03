import { useRef, useState, useEffect } from 'react';
import { App } from 'antd';
import {config} from '@/common/config'
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import { useMount, } from 'ahooks';
import {fileApi} from "@/api/file";

import tinymce from 'tinymce/tinymce';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/themes/silver';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default'; // 引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom'; // 这里是个坑 一定要引入

import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 有序列表无序列表插件
import "tinymce/plugins/advlist"; // 有序列表无序列表插件 扩展
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/code"; // 查看源码
import "tinymce/plugins/fullscreen"; // 全屏
import "tinymce/plugins/anchor"; // 锚点
import "tinymce/plugins/autolink"; // 自动识别插入链接
//import "tinymce/plugins/autoresize"; // 编辑器高度自动
import "tinymce/plugins/autosave"; // 刷新页面会提示内容未保存
import "tinymce/plugins/charmap"; // 插入特殊字符
import "tinymce/plugins/codesample"; // 插入代码
import "tinymce/plugins/directionality"; // 恢复上次的草稿
import "tinymce/plugins/image"; // 上传图片插件
//import "tinymce/plugins/importcss"; //
import "tinymce/plugins/insertdatetime"; // 插入时间
import "tinymce/plugins/link"; // 插入链接
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/nonbreaking"; // 插入不间断的空格
import "tinymce/plugins/pagebreak"; // 插入分页符
import "tinymce/plugins/preview"; // 预览
import "tinymce/plugins/quickbars"; //获取焦点的时候自动弹窗图片 跟 表格
//import "tinymce/plugins/save"; // 保存，会提示没得表单控件
import "tinymce/plugins/searchreplace"; // 搜索替换
//import "tinymce/plugins/template"; // 模板，用不起
import "tinymce/plugins/visualblocks"; // 显示区块边界
import "tinymce/plugins/visualchars"; // 显示不可见的字符
//import "tinymce/plugins/help"; // 显示帮助
import "./tinymce/plugins/axupimgs"; // 图片批量上传 引的是当前目录
import "./tinymce/plugins/emoticons"; // 插入表情 引的是当前目录
import "./tinymce/plugins/indent2em"; // 首行缩进 引的是当前目录

import './index.css';


/**
 * @param {value} String 默认值
 * @param {onChange} fun 修改value事件
 * @param {disabled} Boolean 是否禁用编辑器
 * @param {toolbarDisabled} Boolean 工具栏是否显示，如果是在弹出框里面的就需要禁用，否则点击更多工具的时候，弹窗关闭了，而工具选择无法关闭
 * @parrm {height} Int 编辑器高度
 */
export default ({ value = '', onChange, disabled = false, toolbarDisabled = false, height = 400 }) => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);
    const editorRef = useRef();
    const { message } = App.useApp();
    // 编辑器初始值
    const [initialValue, setInitialValue] = useState(value);
    // 编辑器的值
    const [val, setVal] = useState(value);

    // 父组件的value不等于本组件的value的时候，就更新本组价的value
    useEffect(() => {
        if (val !== value) {
            setInitialValue(value);
        }
    }, [value])
    useEffect(() => {
        onChange?.(val);
    }, [val])
    useMount(() => {
        tinymce.init({})
    })

    const init = {
        selector: editorRef, // 富文本编辑器的id,
        skin_url: layoutSetting.antdThemeValue == 'dark' ? `${import.meta.env.BASE_URL}tinymce/skins/ui/oxide-dark` : `${import.meta.env.BASE_URL}tinymce/skins/ui/oxide`, // skin路径，具体路径看自己的项目
        content_css: `${import.meta.env.BASE_URL}tinymce/skins/content/default/content.css`, // 以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
        emoticons_database_url: `${import.meta.env.BASE_URL}tinymce/plugins/emoticons/js/emojis.js`, // 表情包路劲
        language_url: `${import.meta.env.BASE_URL}tinymce/langs/zh-Hans.js`, // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
        language: "zh-Hans", // 语言
        height: height, // 编辑器高度
        min_height: 200, // 编辑器最小高
        placeholder: '请输入...',
        branding: false, // 是否禁用
        promotion: false, // 隐藏又上角升级按钮
        menubar: true, // 顶部菜单栏显示
        autosave_interval: '5s', // 编辑器每隔3秒就自动保存草稿
        autosave_retention: '1440m', // 编辑器草稿保存的时间，单位分钟
        convert_urls: false, // 上传图片等附件后 禁止将编辑器中的图片附件等地址自动转为相对路径

        menu: {
            //file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
            //edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            //view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: 'Insert', items: 'image axupimgs link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            // format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
            // tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            // table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableuploadApi deletetable' },
            // help: { title: 'Help', items: 'help' }
        },

        // 需要的插件，新增的插件必须先放入这
        plugins: 'indent2em lists advlist table wordcount code fullscreen anchor autolink autosave charmap directionality image insertdatetime link media nonbreaking pagebreak preview searchreplace visualblocks visualchars axupimgs emoticons quickbars ',

        // 摆在上面的编辑器的操作
        toolbar: toolbarDisabled ? `` : `undo redo | fontsize  styles |  forecolor backcolor |indent2em outdent indent | bullist numlist |  image axupimgs link media | code fullscreen`,

        font_family_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', // 字体
        font_size_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', // 文字大小

        // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        // paste_webkit_styles: "all",
        // paste_merge_formats: true,
        // nonbreaking_force_tab: false,
        // paste_auto_cleanup_on_paste: false,
        // file_picker_types: 'file',

        quickbars_insert_toolbar: 'quicktable image axupimgs media link', // 新的一行焦点的时候，弹出快捷操作
        quickbars_selection_toolbar: 'bold italic underline removeformat forecolor backcolor | blocks | link', // 选择一块文字的时候，弹出快捷操作

        content_style: "*{max-width:100% !important;}", // 自定义样式，

        link_default_target: '_blank', // 插入链接自动识别了后默认新窗口打开

        image_dimensions: false, // 上传图片弹出去除宽高属性

        media_filter_html: false, // 禁用视频弹窗中粘贴html
        media_poster: true, // 开启可以上传视频封面
        media_alt_source: false, // 关闭视频备选url
        // 弹窗里面 上传图标里面的文件上传
        file_picker_callback: (callback, value, meta) => {
            // 点击上传附件的时候
            if (meta.filetype == 'file') {
                let inputElem = document.createElement("input"); // 创建文件选择
                inputElem.setAttribute("type", "file");
                inputElem.setAttribute("accept", ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4,.mkv, .avi,.wmv, .rmvb,.mov,.mpg,.mpeg,.webm, .jpg, .jpeg, .png, .gif");
                inputElem.click();

                inputElem.onchange = (e) => {
                    const file = e.target.files[0];
                    uploadFile(file, 'file').then(file_url => {
                        callback(file_url, {
                            text: file.name,
                            title: file.name
                        });
                    }).catch(err => {
                    })
                };
            }

            // 上传图片的时候
            if (meta.filetype == 'image') {
                const inputElem = document.createElement('input');
                inputElem.setAttribute('type', 'file');
                inputElem.setAttribute('accept', 'image/*');
                inputElem.click();

                inputElem.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    uploadFile(file, 'img').then(file_url => {
                        callback(file_url, {
                            alt: file.name
                        });
                    }).catch(err => {
                    })
                });
            }

            // 上传媒体的时候，视频或音乐
            if (meta.filetype == 'media') {
                const inputElem = document.createElement('input');
                inputElem.setAttribute('type', 'file');
                inputElem.setAttribute('accept', 'audio/*,video/*');
                inputElem.click();

                inputElem.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    uploadFile(file, 'media').then(file_url => {
                        callback(file_url);
                    }).catch(err => {
                    })
                });
            }
        },
        // 图片上传
        images_upload_handler: (blobInfo) => uploadFile(blobInfo.blob(), 'img', false),
        // 多图上传后
        images_upload_imgs: (blobInfo, success, error) => uploadFile(blobInfo.blob(), 'img').then(file_url => {
            success(file_url, blobInfo.blob().name);
        }).catch(err => {
            error();
        }),
    }

    // 上传前文件验证 type：img》图片，media》媒体，file》文件
    const uploadValidata = (file, type) => {
        // 获取后缀
        let flieArr = file.name.split(".");
        let suffix = flieArr[flieArr.length - 1];

        if (type === 'img') {
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(suffix) === -1) {
                return '只能上传图片~';
            }
            if (file.size / 1024 / 1024 > config.uploadImgMax) {
                return `上传失败，图片大小请控制在 ${config.uploadImgMax}M 以内`;
            }
        }
        if (type === 'media') {
            if (["avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4", "mp3", "wma", "avi", "rm", "rmvb", "flv", "mpg", "mkv"].indexOf(suffix) === -1) {
                return '只能上传音视频文件~';
            }
            if (file.size / 1024 / 1024 > config.uploadMediaMax) {
                return `上传失败，媒体大小请控制在 ${config.uploadMediaMax}M 以内`;
            }
        }
        if (type === 'file') {
            if (['pdf', 'txt', 'zip', 'rar', '7z', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'mp3', 'mp4', 'mkv', 'avi', 'wmv', 'rmvb', 'mov', 'mpg', 'mpeg', 'webm', 'jpg', 'jpeg', 'png', 'gif'].indexOf(suffix) === -1) {
                return '禁止上传此文件类型~';
            }
            if (file.size / 1024 / 1024 > config.uploadFileMax) {
                return `上传失败，附件大小请控制在 ${config.uploadFileMax}M 以内`;
            }
        }
        return true;
    }

    // 文件上传 type：img》图片，media》媒体，file》文件，is_error:是否弹窗错误提示
    const uploadFile = (file, type = 'img', is_error = true) => {
        return new Promise((resolve, reject) => {
            // 上传验证文件
            const validata = uploadValidata(file, type);
            if (validata !== true) {
                if (is_error) {
                    message.error(validata);
                    reject(false);
                } else {
                    reject(validata)
                }
                return false;
            }

            const hideLoading = message.loading('上传中...', 0);
            fileApi.upload({ file }).then((res) => {
                hideLoading();
                if (res.data.code === 1) {
                    resolve(res.data.data.file)
                } else {
                    if (is_error) {
                        message.error(res.data.message);
                        reject(false);
                    } else {
                        reject(res.data.message)
                    }

                }
            }).catch(info => {
                hideLoading();
                if (is_error) {
                    message.error('上传错误~');
                    reject(false);
                } else {
                    reject('上传错误~')
                }
            });
        });
    }

    return (
        <>
            <Editor
                initialValue={initialValue}
                init={init}
                ref={editorRef}
                disabled={disabled}
                onEditorChange={_val => {
                    setVal(_val);
                }}
            />
        </>
    )
}
