package com.awspaas.user.apps.devcase.tempUser.service;

import com.actionsoft.bpms.commons.mvc.view.ResponseObject;

import java.util.Map;

public interface CreateTempUser {

    // 生成临时账号申请单编号
    String createFormNo(String preFix) throws Exception;
    // 生成临时账号ID
    String createTempUserId() throws Exception;
    // 生成密码
    String createTempUserPassword(String idCard) throws Exception;
    // 创建流程
    ResponseObject createProcess(Map<String, Object> map);

}
