package com.awspaas.user.apps.devcase.notice.aslp;

import com.actionsoft.apps.resource.interop.aslp.ASLP;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.awspaas.user.apps.devcase.notice.service.NoticeService;
import com.awspaas.user.apps.devcase.notice.service.NoticeServiceImpl;

import java.util.Map;

public class AslpCreateNoticeProcess implements ASLP {

    private NoticeService noticeService = new NoticeServiceImpl();

    @Override
    public ResponseObject call(Map<String, Object> map) {
        return noticeService.createNoticeProcess(map);
    }
}
