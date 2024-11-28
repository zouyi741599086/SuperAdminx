# SuperAdminx-WebmanReact

#### 介绍
没有高科技，更没有黑科技，实用为主，后端基于[workerman](https://www.workerman.net/)的[webman](https://www.workerman.net/webman)高性能HTTP框架，常用的[ThinkORM](https://doc.thinkphp.cn/@think-orm/)、[ThinkValidate](https://doc.thinkphp.cn/v8_0/validator.html)，前端基于`react`用`js`写的，主要用到的组件库是[Ant Design](https://ant.design/index-cn)、[ProComponents](https://procomponents.ant.design/)


#### 软件架构
webman、ThinkORM、ThinkValidate

react、Ant Design、Ant Design Pro Components

#### 使用文档
[SuperAdminx文档](http://www.superadminx.com)

#### 预览
[点此预览](http://www.superadminx.com/preview.html)

#### 安装教程

**环境要求**
- php 8+ 
- mysql 5.6+
- node 21+

**php需要的扩展**
- fileinfo
- imagemagick
- exif
- pdo_sqlsrv
- xlswriter 表格导入导出用的此扩展，如导入导出换成其它逻辑可以不用安装
- redis 非必须，如果要用消息列队

**php需要解除的禁用函数**
- [点此查看webman官方说明](https://www.workerman.net/doc/webman/others/disable-function-check.html)

**开始安装**

1. git获取源码
``` sh
git clone https://gitee.com/zouyi/super-adminx-webman-react.git
```
或者
``` sh
git clone https://gitee.com/wolf18/EasyAdmin8-webman
```

2. 进入项目根目录，安装依赖
``` sh
composer install
```

3. 数据库
- 新建数据库，导入根目录下 `superadminx.sql`，此sql是用navicat导出的
- 修改根目录下 `.env` 里面数据库配置

<br />

4. 启动项目

windows用户：双击项目根目录 `windows.bat` 或者在根目录运行 `php windows.php` 启动

linux用户：调试方式运行 `php start.php start`，守护进程方式运行 `php start.php start -d`

更多细节参考[webman官方文档](https://www.workerman.net/doc/webman/install.html)

<br />

5. 进行`根目录/public/admin_react/`，安装前端依赖
``` sh
npm install
```

6. 运行前端，即可访问`http://localhost:5200/admin/`
``` sh
npm run dev
```
