package com.awspaas.user.apps.devcase.notice.service;

import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;

import java.util.Map;

public interface NoticeService {

    ResponseObject createOrUpdateBRecords(UserContext userContext, String ids);
    ResponseObject releaseNotice(UserContext userContext, String ids);
    ResponseObject closeNotice(UserContext userContext, String ids);
    ResponseObject createNoticeProcess(Map<String, Object> map);
    String browseNotice(UserContext userContext,String id);
    String getOptionLogNotice(UserContext userContext,String id);
    String getBrowseRecords(UserContext userContext,String id);
}
