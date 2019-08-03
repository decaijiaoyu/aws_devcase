package com.awspaas.user.apps.devcase.notice.service;

import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;

import java.util.Map;

public interface NoticeService {

    // 创建或新增浏览记录
    ResponseObject createOrUpdateBRecords(UserContext userContext, String ids);
    // 公告发布
    ResponseObject releaseNotice(UserContext userContext, String ids);
    // 公告关闭
    ResponseObject closeNotice(UserContext userContext, String ids);
    // 创建公告流程
    ResponseObject createNoticeProcess(Map<String, Object> map);
    // 公告预览
    String browseNotice(UserContext userContext,String id);
    // 获取公告操作日志
    String getOptionLogNotice(UserContext userContext,String id);
    // 获取浏览记录
    String getBrowseRecords(UserContext userContext,String id);
}
