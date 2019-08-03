package com.awspaas.user.apps.devcase.tempUser.service;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.model.run.delegate.ProcessInstance;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;
import com.actionsoft.sdk.local.SDK;
import com.awspaas.user.apps.devcase.util.WebPage;

import java.util.HashMap;
import java.util.Map;

public class OutCreateTempUserImpl implements OutCreateTempUser {

    private CreateTempUser createTempUser = new CreateTempUserImpl();

    @Override
    public String getTempUserApplyUrl(String ip) {
        // 生成临时账号申请链接
        // 获取当前时间戳
        long time_long = System.currentTimeMillis();
        BO bo = new BO();

        // 获取配置的服务器ip地址
        String local_ip = SDK.getAppAPI().getProperty("com.awspaas.user.apps.devcase", "localhost");
        if (local_ip == null || local_ip.equals("")) {
            // 不存在直接返回空
            return "";
        }

        // 访问ip
        bo.set("IP", ip);
        // 是否关闭
        bo.set("ISCLOSE", "0");
        // 是否被使用
        bo.set("ISUSED", "0");
        // 当前激活时间
        bo.set("ACTIVATETIME", time_long);
        // 创建链接创建的相关数据
        SDK.getBOAPI().createDataBO("BO_EU_YH_SID", bo, UserContext.fromUID("admin"));
        // 返回申请连接
        return local_ip + "/r/w?cmd=com.awspaas.user.apps.devcase_AWS_API_OPENATUFORM&yhsid=" + bo.getId();
    }

    @Override
    public String openTempUserApplyForm(String ip, String yhsid) throws Exception{
        // 打开临时账号申请表单
        Map<String, Object> map = new HashMap<String, Object>();
        // 应用id
        String AppId = "com.awspaas.user.apps.devcase";
        // 获取连接的相关信息
        BO bo = SDK.getBOAPI().get("BO_EU_YH_SID", yhsid);
        if (bo == null) {
            // url链接错误
            map.put("errorInfo", "");
            return WebPage.getPage(AppId, "ErrorPage.html", map);
        } else {
            if (bo.get("IP") == null || !bo.getString("IP").equals(ip)) {
                // 异常访问
                map.put("errorInfo", "异常访问");
                return WebPage.getPage(AppId, "ErrorPage.html", map);
            } else if (bo.getString("ISUSED").equals("1")) {
                // 已失效
                map.put("errorInfo", "该链接已失效");
                return WebPage.getPage(AppId, "ErrorPage.html", map);
            } else if (bo.getString("ISCLOSED").equals("1")) {
                // 已过期
                map.put("errorInfo", "该链接已过期");
                return WebPage.getPage(AppId, "ErrorPage.html", map);
            }

            // 获取当前时间戳
            long now_long = System.currentTimeMillis();
            // 获取激活时间戳
            String activate_String = bo.get("ACTIVATETIME") == null ? "" : bo.getString("ACTIVATETIME");
            activate_String = activate_String.equals("") ? "0" : activate_String;
            long activate_long = Long.parseLong(activate_String);

            // 获取配置的url失效时间
            String limitTime = SDK.getAppAPI().getProperty(AppId,"UrlLostTime");
            if(limitTime.equals("")){
                // 空值时 24小时
                limitTime = "86400000";
            }
            long limitTimeL = Long.parseLong("86400000");
            try{
                // 数据格式转换
                limitTimeL = Long.parseLong(limitTime);
            }catch (Exception e){
                // 异常时默认24小时
                e.printStackTrace();
                limitTimeL = Long.parseLong("86400000");
            }

            if (now_long > activate_long + limitTimeL) {
                // 已过期-24小时
                map.put("errorInfo", "该链接已过期");
                bo.set("ISCLOSED", "1");
                SDK.getBOAPI().update("BO_EU_YH_SID", bo);
                return WebPage.getPage(AppId, "ErrorPage.html", map);
            }

            map.put("yhsid", yhsid);
            return WebPage.getPage(AppId, "out-tempUserForm.html", map);
        }
    }

    @Override
    public String submitTempUserApplyForm(String userName, String idCard, String reason, String time, String unit,String yhsid) throws Exception {
        // 根据提交的数据创建临时用户申请流程
        return createProcessDetail(userName, idCard, reason, time, unit, yhsid);
    }


    private String createProcessDetail(String userName, String idCard, String reason, String time, String unit, String yhsid) throws Exception {
        // 根据提交的数据创建临时用户申请流程
        ResponseObject responseObject;
        try {
            BO tempUserBo = new BO();

            tempUserBo.set("USERNAME", userName);
            tempUserBo.set("IDCARD", idCard);
            tempUserBo.set("REASON", reason);
            tempUserBo.set("TIMESIZE", time);
            tempUserBo.set("TIMEUNIT", unit);
            String formNo = createTempUser.createFormNo("EX");// 外部前缀为EX
            tempUserBo.set("FORMNO", formNo);

            // 创建流程
            ProcessInstance processInstance = SDK.getProcessAPI().createProcessInstance("obj_6ae25b5bcb734d678bc14b5a0c9d0327", "admin", userName + "申请临时账号");
            // 创建数据
            SDK.getBOAPI().create("BO_EU_TEMPUSER", tempUserBo, processInstance, UserContext.fromUID("admin"));
            // 启动流程
            SDK.getProcessAPI().start(processInstance);
            // 第一个节点自动提交
            SDK.getTaskAPI().completeTask(processInstance.getStartTaskInstId(), "admin");
            // 返回前端单据编号
            responseObject = ResponseObject.newOkResponse(formNo);

            // url申请链接设置为失效，已使用
            BO yh_sid_bo = SDK.getBOAPI().get("bo_eu_yh_sid",yhsid);
            if(yh_sid_bo!=null){
                yh_sid_bo.set("ISUSED",1);
                yh_sid_bo.set("ISCLOSED",1);
                SDK.getBOAPI().update("bo_eu_yh_sid",yh_sid_bo);
            }
        }catch (Exception e){
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse(e.getMessage());
        }
        return responseObject.toString();
    }
}
