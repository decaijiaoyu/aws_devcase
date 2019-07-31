package com.awspaas.user.apps.devcase.util;

import com.actionsoft.bpms.commons.htmlframework.HtmlPageTemplate;
import com.actionsoft.bpms.commons.mvc.view.ActionWeb;

import java.util.Map;

public class WebPage extends ActionWeb {
    public static String getPage(String AppId,String htmlname, Map<String, Object> map){
        return HtmlPageTemplate.merge(AppId,htmlname,map);
    }
}
