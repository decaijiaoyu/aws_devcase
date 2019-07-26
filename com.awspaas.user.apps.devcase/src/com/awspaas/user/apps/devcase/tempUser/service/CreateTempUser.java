package com.awspaas.user.apps.devcase.tempUser.service;

import com.actionsoft.bpms.commons.mvc.view.ResponseObject;

import java.util.Map;

public interface CreateTempUser {

    String createFormNo(String preFix) throws Exception;
    String createTempUserId() throws Exception;
    String createTempUserPassword(String idCard) throws Exception;
    ResponseObject createProcess(Map<String, Object> map);

}
