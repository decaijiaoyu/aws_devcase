package com.awspaas.user.apps.devcase.notice.controller;

import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;
import com.actionsoft.bpms.server.bind.annotation.Controller;
import com.actionsoft.bpms.server.bind.annotation.Mapping;
import com.awspaas.user.apps.devcase.notice.service.NoticeService;
import com.awspaas.user.apps.devcase.notice.service.NoticeServiceImpl;

@Controller
public class NoticeController {

    private NoticeService noticeService = new NoticeServiceImpl();

    @Mapping("com.awspaas.user.apps.devcase_notice_BRecords")
    public ResponseObject createOrUpdateBRecords(UserContext userContext, String ids){
        return noticeService.createOrUpdateBRecords(userContext,ids);
    }

    @Mapping("com.awspaas.user.apps.devcase_notice_release")
    public ResponseObject releaseNotice(UserContext userContext,String ids){
        return noticeService.releaseNotice(userContext,ids);
    }

    @Mapping("com.awspaas.user.apps.devcase_notice_close")
    public ResponseObject closeNotice(UserContext userContext,String ids){
        return noticeService.closeNotice(userContext,ids);
    }

    @Mapping("com.awspaas.user.apps.devcase_notice_browse")
    public String browseNotice(UserContext userContext,String id){
        return noticeService.browseNotice(userContext,id);
    }

    @Mapping("com.awspaas.user.apps.devcase_notice_optionlog")
    public String getOptionLogNotice(UserContext userContext,String id){
        return noticeService.getOptionLogNotice(userContext,id);
    }

    @Mapping("com.awspaas.user.apps.devcase_notice_Browselog")
    public String getBrowseRecords(UserContext userContext, String id){
        return noticeService.getBrowseRecords(userContext,id);
    }
}
