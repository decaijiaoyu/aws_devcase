package com.awspaas.user.apps.devcase.tempUser.controller;

import com.actionsoft.bpms.server.bind.annotation.Controller;
import com.actionsoft.bpms.server.bind.annotation.Mapping;
import com.awspaas.user.apps.devcase.tempUser.service.OutCreateTempUser;
import com.awspaas.user.apps.devcase.tempUser.service.OutCreateTempUserImpl;

@Controller
public class TempUserController {

    private OutCreateTempUser outCreateTempUser = new OutCreateTempUserImpl();

    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_GETATUURL",session = false,noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String getTempUserApplyUrl(String clientIp) throws Exception{
        return outCreateTempUser.getTempUserApplyUrl(clientIp);
    }

    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_OPENATUFORM",session = false,desc = "打开表单页面",noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String getTempUserApplyForm(String clientIp,String yhsid) throws Exception{
        return outCreateTempUser.openTempUserApplyForm(clientIp,yhsid);
    }

    @Mapping(value = "com.awspaas.user.apps.devcase_AWS_API_SUBMITATUFORM",session = false,desc = "提交表单",noSessionReason = "独立校验",noSessionEvaluate = "无安全隐患")
    public String submitATUForm(String userName,String idCard,String reason,String time,String unit,String yhsid) throws Exception{
        return outCreateTempUser.submitTempUserApplyForm(userName,idCard,reason,time,unit,yhsid);
    }
}
