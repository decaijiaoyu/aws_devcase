package com.awspaas.user.apps.devcase.tempUser.service;

public interface OutCreateTempUser {

    // 获取外部申请临时账号连接
    String getTempUserApplyUrl(String clientIp);
    // 获取外部申请临时账号页面
    String openTempUserApplyForm(String clientIp,String yhsid) throws Exception;
    // 提交外部申请临时账号数据
    String submitTempUserApplyForm(String userName,String idCard,String reason,String time,String unit,String yhsid) throws Exception;
}
