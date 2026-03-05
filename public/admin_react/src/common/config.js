export const config = {
    // 是否开启debug
    debug: import.meta.env.VITE_APP_DEBUG === 'true' ? true : false,
    // 项目的url
    url: import.meta.env.VITE_APP_BASE_URL,
    // 项目名称，显示登录页及登录后左上角
    projectName: 'SuperAdminx后台管理系统',
    // 公司名称，显示在页脚
    company: 'SuperAdminx',
    icp: '渝ICP备xxxxxxxxxx号',
    // 存储本地数据前缀，存在本地的所有数据都有此前缀
    storageDbPrefix: 'adminDb',
    // api请求数据加密，需要跟后端的开关对应
    api_encryptor: {
        // 开关
        enable: import.meta.env.VITE_APP_DEBUG === 'true' ? false : true,
        rsa_public: `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtRjX81sJAu8pyN4IQyXo
    9WE5GYevieBcTiDhGTknKCGMH3sOrdFkj5RwNFzsH5cy//5Otutj4rarHebv5CUo
    XfyBlDwCeyO1ampnZPUEJP50XW54eER5+NH+BFlGxMJJRhuWe9RXRmjdI6iq5trD
    Clr2MrAvFY1e8whjPSka9KXDOdK68bH52goy0bWwDBPWS+8p+f3Le9j82L9sdz2A
    cyoBkwMykgAV80QuE5TTFAwk3ERZf0Koj4QJMYrAEz3qc3B7mAVtbWjUWW7/EhnU
    i2NbsBkUh/n6ftxT86X+g7+nBDSCKGJ+o2z/e3cEc1GZa6pyNUYEt2dsaYad+0vf
    NwIDAQAB
    -----END PUBLIC KEY-----`,
    },
    // 腾讯地图apiKey，form里面的的腾讯经纬度字段组件需要使用
    tencentApiKey: '',
    uploadImgMax: 10, // 图片最大上传xx兆
    uploadFileMax: 100, // 文件最大上传xx兆
    uploadMediaMax: 500, // 媒体最大上传xx兆
};