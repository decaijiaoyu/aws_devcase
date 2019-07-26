package com.awspaas.user.apps.devcase.tempUser.aslp;

import com.actionsoft.apps.resource.interop.aslp.ASLP;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.awspaas.user.apps.devcase.tempUser.service.CreateTempUserImpl;

import java.util.Map;

public class AslpApplyTempUser implements ASLP {

    private CreateTempUserImpl createTempUserImpl = new CreateTempUserImpl();

    @Override
    /*@Meta(parameter = {
            "name:'UserName',required:true,allowEmpty:false,desc'申请人姓名'",
            "name:'IdCard',required:true,allowEmpty:false,desc'申请人身份证号'",
            "name:'Reason',required:true,allowEmpty:false,desc'申请原因'",
            "name:'Time',required:true,allowEmpty:false,desc'申请时长'",
            "name:'Unit',required:true,allowEmpty:false,desc'申请时长单位（天：d,小时：h,分钟：m）'"
            })*/
    public ResponseObject call(Map<String, Object> map) {
        return createTempUserImpl.createProcess(map);
    }
}
