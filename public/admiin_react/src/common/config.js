export const config = {
    //项目的url
    url: import.meta.env.VITE_APP_BASE_URL,
    //项目名称，显示登录页及登录后左上角
    projectName: 'SuperAdminx后台开发框架', 
    //公司名称，显示在页脚
    company: 'SuperAdminx', 
    icp: '渝ICP备15012622号-11',
    //存储本地数据前缀，存在本地的所有数据都有此前缀
    storageDbPrefix: 'adminDb', 
    //是否开启debug
    debug: import.meta.env.VITE_APP_DEBUG === 'true' ? true : false, 
    //加密key
    rsa_public: `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlWJRE4Gv42WoR5l9o8ul
    Hkw+7TF+YrFAa2lzQ/Yykum4fNvsrk2CcDdMI4GZ9xXaYFxopdNAQmd5kPQwQwWq
    Pop0TBoF3ENuMv6vRZBYtd6wbrCu8PrVSQTmnlDQ70iNdDhqqthPGMxxo1giAhbf
    88iu6Ep+APDqL65lkR8rRAV6xfEJK8hN4ZMCQZC9+kGRwSWUvNKh/5pn0dww+LBW
    s43bWUyhwix7QNYU4lrJrT495xcDkZTOFF8B5KTpdxlnKOM5g5d0f1Brrpfil6Sa
    xHPGezFttUPmshwzls/E7UJ+3xwcABHZt04qZlwJFS4kmzT4Km0M009TmP+jtmG7
    swIDAQAB
    -----END PUBLIC KEY-----`,
    uploadImgMax: 10, //图片最大上传xx兆
    uploadFileMax: 100, //文件最大上传xx兆
    uploadMediaMax: 500, //媒体最大上传xx兆
};