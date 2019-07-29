package com.awspaas.user.apps.devcase.tempUser.service;

public interface OutCreateTempUser {
    String getTempUserApplyUrl(String clientIp);
    String openTempUserApplyForm(String clientIp,String yhsid) throws Exception;
    String submitTempUserApplyForm(String userName,String idCard,String reason,String time,String unit,String yhsid) throws Exception;
}
