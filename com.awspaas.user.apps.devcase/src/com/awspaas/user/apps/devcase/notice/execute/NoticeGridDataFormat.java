package com.awspaas.user.apps.devcase.notice.execute;

import com.actionsoft.bpms.dw.design.event.DataWindowFormatDataEventInterface;
import com.actionsoft.bpms.dw.exec.data.DataSourceEngine;
import com.actionsoft.bpms.server.UserContext;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * 数据窗口数据格式化，增加onclick事件
 */
public class NoticeGridDataFormat implements DataWindowFormatDataEventInterface {

    @Override
    public void formatData(UserContext userContext, JSONArray jsonArray) {
        for (Object object : jsonArray) {
            JSONObject jsonObject = (JSONObject) object;
            String title = jsonObject.getString("TITLE");
            title = "<span id=" + '"' + jsonObject.getString("_ID") + '"' + " onclick='browse(" + '"' + jsonObject.getString("_ID") + '"' + ")'>" + title + "</span>";
            jsonObject.put("TITLE" + DataSourceEngine.AWS_DW_FIXED_CLOMUN_SHOW_RULE_SUFFIX, title);
            String times = jsonObject.getString("TIMES");
            times = "<span id=" + '"' + jsonObject.getString("_ID") + '"' + "onclick='openBrowseLog(" + '"' + jsonObject.getString("_ID") + '"' + ")'>" + times + "</span>";
            jsonObject.put("TIMES" + DataSourceEngine.AWS_DW_FIXED_CLOMUN_SHOW_RULE_SUFFIX, times);
            String issuestate = jsonObject.getString("ISSUESTATE");
            issuestate = "<span id=" + '"' + jsonObject.getString("_ID") + '"' + "onclick='openLog(" + '"' + jsonObject.getString("_ID") + '"' + ")'>" + issuestate + "</span>";
            jsonObject.put("ISSUESTATE" + DataSourceEngine.AWS_DW_FIXED_CLOMUN_SHOW_RULE_SUFFIX, issuestate);
        }
    }
}
