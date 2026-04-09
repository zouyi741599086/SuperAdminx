<?php
namespace plugin\admin\app\mer\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\service\ConfigService;

/**
 * 参数设置
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Config
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private ConfigService $configService,
    ) {}

    /**
     * 获取列表
     * @method get
     * @auth configGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->configService->getList($request->get());
        return success($list);
    }

    /**
     * 添加配置
     * @method post
     * @auth configCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $this->configService->create($request->post());
        return success([], '添加成功');
    }

    /**
     * 修改配置数据
     * @method post
     * @auth configUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        $this->configService->update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 修改参数设置
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateContent(Request $request) : Response
    {
        $this->configService->updateContent($request->post());
        return success([], '修改成功');
    }

    /**
     * 获取一条数据
     * @method get
     * @param int $id
     * @param string $name
     * @return Response
     */
    public function findData(?int $id = null, ?string $name = null) : Response
    {
        $data = $this->configService->findData($id, $name);
        return success($data);
    }

    /**
     * 删除配置
     * @method post
     * @auth configDelete
     * @param int $id
     * @return Response
     */
    public function delete(int $id) : Response
    {
        $this->configService->delete($id);
        return success([], '删除成功');
    }

    /**
     * 修改排序
     * @method post
     * @auth configUpdateSort
     * @param Request $request 
     * @return Response
     */
    public function updateSort(Request $request) : Response
    {
        $this->configService->updateSort($request->post('list'));
        return success([], '修改成功');
    }

    /**
     * 获取配置
     * @method post
     * @param string $name 
     * @return Response
     */
    public function getConfig(string $name) : Response
    {
        $config = $this->configService->getConfig($name, 'array');
        return success($config);
    }
}
