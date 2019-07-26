package com.awspaas.user.apps.devcase.tempUser.execute;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.core.delegate.ProcessExecutionContext;
import com.actionsoft.bpms.bpmn.engine.listener.ExecuteListenerInterface;
import com.actionsoft.sdk.local.SDK;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUserImpl;

import java.util.Date;


public class LastTaskAfterApprovalTempUser implements ExecuteListenerInterface {

    private CreateTempUserImpl createTempUserImpl = new CreateTempUserImpl();

    @Override
    public void execute(ProcessExecutionContext processExecutionContext) throws Exception {
        BO applyTempUser = processExecutionContext.getBO("BO_EU_TEMPUSER");
        boolean isAgree = processExecutionContext.isChoiceActionMenu("同意");
        if(isAgree){
            applyTempUser.set("FORMSTATUS","审核通过");
            // 部门名称
            String departmentName = applyTempUser.getString("DEPARTMENTNAME");
            // 部门ID
            String departmentId = applyTempUser.getString("DEPARTMENTID");
            // 角色名称
            String roleName = applyTempUser.getString("ROLENAME");
            // 角色ID
            String roleId = applyTempUser.getString("ROLEID");
            // 申请人姓名
            String userName = applyTempUser.getString("USERNAME");
            // 申请人身份证号
            String idCard = applyTempUser.getString("IDCARD");
            // 生成临时账号密码
            String userId = applyTempUser.getString("PREFIX") + createTempUserImpl.createTempUserId();
            String password = createTempUserImpl.createTempUserPassword(idCard);
            // 是否部门主管
            boolean isManager = applyTempUser.get("ISMANAGER") != null && applyTempUser.getString("ISMANAGER").equals("1");
            // 生成账号 成功返回1，失败返回0
            int size = SDK.getORGAPI().createUser(departmentId,userId,userName,roleId,password,isManager);
            // 成功生成账号，将数据反写
            if(size == 1) {
                // 通过填写的期限生成long类型数据
                long limitTime = 0;
                // 期限 默认：3
                String time_size = applyTempUser.get("TIMESIZE") == null ? "3" : applyTempUser.getString("TIMESIZE");
                // 单位 默认：天
                String time_unit = applyTempUser.get("TIMEUNIT") == null ? "d" : applyTempUser.getString("TIMEUNIT");
                switch (time_unit) {
                    case "d":
                        limitTime = Long.parseLong(String.valueOf(Integer.parseInt(time_size) * 24 * 60 * 60 * 1000));
                        break;
                    case "h":
                        limitTime = Long.parseLong(String.valueOf(Integer.parseInt(time_size) * 60 * 60 * 1000));
                        break;
                    case "m":
                        limitTime = Long.parseLong(String.valueOf(Integer.parseInt(time_size) * 60 * 1000));
                        break;
                }

                // 将数据反写
                applyTempUser.set("LIMITTIME", limitTime);
                applyTempUser.set("UID", userId);
                applyTempUser.set("ACTIVATETIME", new Date());
            }
        }else {
            applyTempUser.set("FORMSTATUS","审核不通过");
        }
        SDK.getBOAPI().update("BO_EU_TEMPUSER",applyTempUser);
    }

    @Override
    public String getProvider() {
        return "珠海用心科技有限公司";
    }

    @Override
    public String getDescription() {
        return "临时账号工作人员审核后，改变单据状态";
    }

    @Override
    public String getVersion() {
        return "1.0";
    }
}
