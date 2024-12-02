export const config = {
    //是否开启debug
    debug: import.meta.env.VITE_APP_DEBUG === 'true' ? true : false,
    //项目的url
    url: import.meta.env.VITE_APP_BASE_URL,
    //项目名称，显示登录页及登录后左上角
    projectName: 'SuperAdminx后台开发框架',
    //公司名称，显示在页脚
    company: 'SuperAdminx',
    icp: '渝ICP备xxxxxxxxxx号',
    //存储本地数据前缀，存在本地的所有数据都有此前缀
    storageDbPrefix: 'adminDb',
    //api请求数据加密，需要跟后端的开关对应
    api_encryptor: {
        //开关
        enable: import.meta.env.VITE_APP_DEBUG === 'true' ? false : true,
        rsa_public: `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqNoRA7DlwWAp5N3Ax5eb
    vt2ixWPaYOZXU+cprnubb75zoCbyks9zajuYPeSLUHF/jeg11aMcm/VC2URT/lpN
    0PbdhvjASPhVw5Sr//TSfZpXWzAcVvbT/6i+vaQ3tUdXtstL9kG59bUUgAP2geYz
    FVNSHHLwxDiuX+Cve6nXPY2hD01KQ5VqSmD5k8Lm3OrxU7FzCCipGT8DfPJrRMU+
    T+UrESQOKK1Y96Q274z0XI6tM29f76lBX/uUooodMn8OufBaah/+yb3FCq3bydIn
    vUgn2HeTk8+vv9uVLZKXcyIHQNTGOk/fUZFLxx88k1Pnkh37EKA6cb4hzB6FGBMa
    PwIDAQAB
    -----END PUBLIC KEY-----`,
    },
    //腾讯地图apiKey，form里面的的腾讯经纬度字段组件需要使用
    tencentApiKey: '',
    uploadImgMax: 10, //图片最大上传xx兆
    uploadFileMax: 100, //文件最大上传xx兆
    uploadMediaMax: 500, //媒体最大上传xx兆
};