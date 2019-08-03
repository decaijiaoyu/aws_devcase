package com.awspaas.user.apps.devcase.tempUser.controller;

import com.actionsoft.bpms.server.bind.annotation.Controller;
import com.actionsoft.bpms.server.bind.annotation.Mapping;
import com.awspaas.user.apps.devcase.tempUser.service.OutCreateTempUser;
import com.awspaas.user.apps.devcase.tempUser.service.OutCreateTempUserImpl;

@Controller
public class TempUserController {

    private OutCreateTempUser outCreateTempUser = new OutCreateTempUserImpl();

    /**
     * 获取申请临时账号链接
     * @param clientIp
     * @return
     * @throws Exception
     */
    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_GETATUURL",session = false,noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String getTempUserApplyUrl(String clientIp) throws Exception{
        return outCreateTempUser.getTempUserApplyUrl(clientIp);
    }

    /**
     * 打开临时账号申请页面
     * @param clientIp
     * @param yhsid
     * @return
     * @throws Exception
     */
    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_OPENATUFORM",session = false,desc = "打开表单页面",noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String getTempUserApplyForm(String clientIp,String yhsid) throws Exception{
        return outCreateTempUser.openTempUserApplyForm(clientIp,yhsid);
    }

    /**
     * 临时页面提交申请
     * @param userName
     * @param idCard
     * @param reason
     * @param time
     * @param unit
     * @param yhsid
     * @return
     * @throws Exception
     */
    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_SUBMITATUFORM",session = false,desc = "提交表单",noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String submitATUForm(String userName,String idCard,String reason,String time,String unit,String yhsid) throws Exception{
        return outCreateTempUser.submitTempUserApplyForm(userName,idCard,reason,time,unit,yhsid);
    }
}
