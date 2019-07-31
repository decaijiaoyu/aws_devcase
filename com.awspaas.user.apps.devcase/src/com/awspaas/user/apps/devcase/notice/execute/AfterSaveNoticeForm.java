package com.awspaas.user.apps.devcase.notice.execute;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.core.delegate.ProcessExecutionContext;
import com.actionsoft.bpms.bpmn.engine.listener.ExecuteListenerInterface;

public class AfterSaveNoticeForm implements ExecuteListenerInterface {
    @Override
    public void execute(ProcessExecutionContext processExecutionContext) throws Exception {
        BO bo = processExecutionContext.getBO("bo_eu_info");

    }

    @Override
    public String getProvider() {
        return "珠海用心科技有限公司";
    }

    @Override
    public String getDescription() {
        return "公告保存后，数据处理";
    }

    @Override
    public String getVersion() {
        return "1.0";
    }
}
