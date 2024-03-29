package com.awspaas.user.apps.devcase.tempUser.execute;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.core.delegate.ProcessExecutionContext;
import com.actionsoft.bpms.bpmn.engine.listener.ExecuteListenerInterface;
import com.actionsoft.sdk.local.SDK;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUser;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUserImpl;

public class AfterSubmitApplyTempUser implements ExecuteListenerInterface {

    private CreateTempUser createTempUser = new CreateTempUserImpl();

    @Override
    public void execute(ProcessExecutionContext processExecutionContext) throws Exception {
        // 修改单据状态
        BO tempUserBo = processExecutionContext.getBO("BO_EU_TEMPUSER");
        tempUserBo.set("FORMSTATUS","待审核");
        // 生成临时账号申请单编号
        tempUserBo.set("FORMNO",createTempUser.createFormNo(tempUserBo.getString("PREFIX")));
        SDK.getBOAPI().update("BO_EU_TEMPUSER",tempUserBo);
    }

    @Override
    public String getProvider() {
        return "珠海用心科技有限公司";
    }

    @Override
    public String getDescription() {
        return "申请临时用户提交后改变单据状态";
    }

    @Override
    public String getVersion() {
        return "1.0";
    }
}
