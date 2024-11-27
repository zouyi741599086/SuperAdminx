<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\common\logic\WordTemplateLogic;

/**
 * word模板 控制器
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WordTemplate
{

    // 此控制器是否需要登录
    protected $onLogin = true;

    // 不需要登录的方法
    protected $noNeedLogin = [];


    /**
     * 列表
     * @method get
     * @auth wordTemplate
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = WordTemplateLogic::getList($request->get());
        return success($list);
    }

    /**
     * @log 新增word模板
     * @method post
     * @auth wordTemplateCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        WordTemplateLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * 获取数据
     * @method get
     * @param int $id 
     * @return Response
     */
    public function findData(int $id) : Response
    {
        $data = WordTemplateLogic::findData($id);
        return success($data);
    }

    /**
     * @log 修改word模板
     * @method post
     * @auth wordTemplatUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        WordTemplateLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除word模板
     * @method post
     * @auth wordTemplateDelete
     * @param int|array $id 
     * @return Response
     */
    public function delete(int|array $id) : Response
    {
        WordTemplateLogic::delete($id);
        return success([], '删除成功');
    }

    /**
     * @log 更改word模板排序
     * @method post
     * @auth wordTemplateSort
     * @param array $list 
     * @return Response
     * */
    public function updateSort(array $list) : Response
    {
        WordTemplateLogic::updateSort($list);
        return success();
    }

    /**
     * @log 修改word模板状态
     * @method post
     * @auth wordTemplateStatus
     * @param int $id 数据id
     * @param int $status 数据状态 
     * @return Response
     */
    public function updateStatus(int $id, int $status) : Response
    {
        WordTemplateLogic::updateStatus($id, $status);
        return success();
    }

    /**
     * @log 搜索选择某条数据
     * @method get
     * @param string $keywords 搜索的关键字
     * @param int $id 选中的数据id
     * @return Response
     */
    public function selectWordTemplate(string $keywords = null, int $id = null) : Response
    {
        $list = WordTemplateLogic::selectWordTemplate($keywords, $id);
        return success($list);
    }

    /**
     * 下载导入word模板数据的表格模板
     * @method get
     * @auth wordTemplateImport
     * @param Request $request 
     * @return Response
     */
    public function downloadImportExcel(Request $request) : Response
    {
        $data = WordTemplateLogic::downloadImportExcel();
        return success($data);
    }

    /**
     * @log 导入word模板数据
     * @method post
     * @auth wordTemplateImport
     * @param Request $request 
     * @return Response
     */
    public function importData(Request $request) : Response
    {
        $result = upload_public('/tmp_file');
        if (! isset($result['file']) || ! $result['file']) {
            abort('请上传导入的表格');
        }
        WordTemplateLogic::importData($result['file']);
        return success();
    }

    /**
     * @log 导出word模板数据
     * @method get
     * @auth wordTemplateExport
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $data = WordTemplateLogic::exportData($request->get());
        return success($data);
    }


    /**
     * @log 批量更新所属用户
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateAllUserId(Request $request) : Response
    {
        $data = WordTemplateLogic::updateAllUserId($request->post());
        return success($data);
    }

}