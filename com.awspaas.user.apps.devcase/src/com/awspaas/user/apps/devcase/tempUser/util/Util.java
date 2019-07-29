package com.awspaas.user.apps.devcase.tempUser.util;

import com.actionsoft.bpms.commons.htmlframework.HtmlPageTemplate;
import com.actionsoft.bpms.commons.mvc.view.ActionWeb;
import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;

import java.io.StringWriter;
import java.util.Map;

public class Util extends ActionWeb {


    public String getPage(String AppId,String htmlname, Map<String, Object> map) throws Exception{
        String content = HtmlPageTemplate.merge(AppId, htmlname, map);
        Configuration configuration = new Configuration();
        StringTemplateLoader stringTemplateLoader = new StringTemplateLoader();
        StringWriter stringWriter = new StringWriter();
        stringTemplateLoader.putTemplate("myTemplate",content);
        configuration.setTemplateLoader(stringTemplateLoader);
        Template template = configuration.getTemplate("myTemplate");
        template.process(map,stringWriter);
        return content;

    }
}
