package com.awspaas.user.apps.devcase.tempUser.service;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.model.run.delegate.ProcessInstance;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;
import com.actionsoft.sdk.local.SDK;
import com.awspaas.user.apps.devcase.tempUser.util.Util;

import java.util.HashMap;
import java.util.Map;

public class OutCreateTempUserImpl implements OutCreateTempUser {

    private CreateTempUser createTempUser = new CreateTempUserImpl();

    private Util util = new Util();

    @Override
    public String getTempUserApplyUrl(String ip) {
        long time_long = System.currentTimeMillis();
        BO bo = new BO();

        String local_ip = SDK.getAppAPI().getProperty("com.awspaas.user.apps.devcase", "localhost");
        if (local_ip == null || local_ip.equals("")) {
            return "";
        }

        bo.set("IP", ip);
        bo.set("ISCLOSE", "0");
        bo.set("ISUSED", "0");
        bo.set("ACTIVATETIME", time_long);
        SDK.getBOAPI().createDataBO("BO_EU_YH_SID", bo, UserContext.fromUID("admin"));
        return local_ip + "/r/jd?cmd=com.awspaas.user.apps.devcase_AWS_API_OPENATUFORM&yhsid=" + bo.getId();
    }

    @Override
    public String openTempUserApplyForm(String ip, String yhsid) throws Exception{
        Map<String, Object> map = new HashMap<String, Object>();
        String AppId = "com.awspaas.user.apps.devcase";
        BO bo = SDK.getBOAPI().get("BO_EU_YH_SID", yhsid);
        if (bo == null) {
            // url链接错误
            map.put("errorInfo", "");
            return util.getPage(AppId, "ErrorPage.html", map);
        } else {
            if (bo.get("IP") == null || !bo.getString("IP").equals(ip)) {
                // 异常访问
                map.put("errorInfo", "异常访问");
                return util.getPage(AppId, "ErrorPage.html", map);
            } else if (bo.getString("ISUSED").equals("1")) {
                // 已失效
                map.put("errorInfo", "该链接已失效");
                return util.getPage(AppId, "ErrorPage.html", map);
            } else if (bo.getString("ISCLOSED").equals("1")) {
                // 已过期
                map.put("errorInfo", "该链接已过期");
                return util.getPage(AppId, "ErrorPage.html", map);
            }

            long now_long = System.currentTimeMillis();
            String activate_String = bo.get("ACTIVATETIME") == null ? "" : bo.getString("ACTIVATETIME");
            activate_String = activate_String.equals("") ? "0" : activate_String;
            long activate_long = Long.parseLong(activate_String);

            if (now_long > activate_long + Long.parseLong("86400000")) {
                // 已过期-24小时
                map.put("errorInfo", "该链接已过期");
                bo.set("ISCLOSED", "1");
                SDK.getBOAPI().update("BO_EU_YH_SID", bo);
                return util.getPage(AppId, "ErrorPage.html", map);
            }

            map.put("yhsid", yhsid);
            return util.getPage(AppId, "out-tempUserForm.html", map);
        }
    }

    @Override
    public String submitTempUserApplyForm(String userName, String idCard, String reason, String time, String unit,String yhsid) throws Exception {
        return createProcessDetail(userName, idCard, reason, time, unit, yhsid);
    }


    private String createProcessDetail(String userName, String idCard, String reason, String time, String unit, String yhsid) throws Exception {
        ResponseObject responseObject;
        try {
            BO tempUserBo = new BO();

            tempUserBo.set("USERNAME", userName);
            tempUserBo.set("IDCARD", idCard);
            tempUserBo.set("REASON", reason);
            tempUserBo.set("TIMESIZE", time);
            tempUserBo.set("TIMEUNIT", unit);
            String formNo = createTempUser.createFormNo("EX");
            tempUserBo.set("FORMNO", formNo);

            ProcessInstance processInstance = SDK.getProcessAPI().createProcessInstance("obj_6ae25b5bcb734d678bc14b5a0c9d0327", "admin", userName + "申请临时账号");
            SDK.getBOAPI().create("BO_EU_TEMPUSER", tempUserBo, processInstance, UserContext.fromUID("admin"));
            SDK.getProcessAPI().start(processInstance);
            SDK.getTaskAPI().completeTask(processInstance.getStartTaskInstId(), "admin");
            responseObject = ResponseObject.newOkResponse(formNo);

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
