<?php
namespace plugin\news\app\api\controller;

use support\Request;
use support\Response;
use plugin\news\app\common\service\NewsClassService;

/**
 * 配置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class NewsClass
{
    //此控制器是否需要登录
    protected $onLogin = false;
    //不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private NewsClassService $newsClassService,
    ) {}

    /**
     * 获取所有分类
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->newsClassService->getList();
        return success($list);
    }

    /**
     * 获取分类详情
     * @method get
     * @param Request $request 
     * @param int $id
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = $this->newsClassService->findData($id);
        return success($data);
    }

    /**
     * 获取下级分类
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getChildrenList(Request $request) : Response
    {
        $data = $this->newsClassService->getChildrenList($request->get('id'));
        return success($data);
    }
}
