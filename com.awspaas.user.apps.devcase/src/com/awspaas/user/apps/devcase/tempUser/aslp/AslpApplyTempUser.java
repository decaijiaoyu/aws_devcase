package com.awspaas.user.apps.devcase.tempUser.aslp;

import com.actionsoft.apps.resource.interop.aslp.ASLP;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUser;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUserImpl;

import java.util.Map;

public class AslpApplyTempUser implements ASLP {

    private CreateTempUser createTempUser = new CreateTempUserImpl();

    // ASLP请求申请临时用户接口
    @Override
    public ResponseObject call(Map<String, Object> map) {
        return createTempUser.createProcess(map);
    }
}
