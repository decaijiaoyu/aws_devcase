package com.awspaas.user.apps.devcase.notice.execute;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.core.delegate.ProcessExecutionContext;
import com.actionsoft.bpms.bpmn.engine.listener.ExecuteListenerInterface;
import com.actionsoft.sdk.local.SDK;

public class LastTaskAfterApprovalNotice implements ExecuteListenerInterface {
    @Override
    public void execute(ProcessExecutionContext processExecutionContext) throws Exception {
        BO bo = processExecutionContext.getBO("bo_eu_info");
        boolean ispass = processExecutionContext.isChoiceActionMenu("同意");
        if(ispass) {
            bo.set("ISSUESTATE", "审核通过");
        }else {
            bo.set("ISSUESTATE", "审核不通过");
        }
        SDK.getBOAPI().update("bo_eu_info",bo);
    }

    @Override
    public String getProvider() {
        return "珠海用心科技有限公司";
    }

    @Override
    public String getDescription() {
        return "公告流程最后审批节点审批后事件";
    }

    @Override
    public String getVersion() {
        return "1.0";
    }
}
