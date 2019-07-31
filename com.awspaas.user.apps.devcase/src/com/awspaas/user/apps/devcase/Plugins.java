package com.awspaas.user.apps.devcase;

import com.actionsoft.apps.listener.PluginListener;
import com.actionsoft.apps.resource.AppContext;
import com.actionsoft.apps.resource.plugin.profile.ASLPPluginProfile;
import com.actionsoft.apps.resource.plugin.profile.AWSPluginProfile;
import com.actionsoft.apps.resource.plugin.profile.HttpASLP;
import com.actionsoft.apps.resource.plugin.profile.SkinsPluginProfile;
import com.awspaas.user.apps.devcase.metroskins.MetroSkinsDemo;
import com.awspaas.user.apps.devcase.notice.aslp.AslpCreateNoticeProcess;
import com.awspaas.user.apps.devcase.tempUser.aslp.AslpApplyTempUser;

import java.util.ArrayList;
import java.util.List;

public class Plugins implements PluginListener {
    public Plugins() {
    }

    @Override
    public List<AWSPluginProfile> register(AppContext appContext) {
        List<AWSPluginProfile> list = new ArrayList<AWSPluginProfile>();
        // 注册门户主题风格
        list.add(new SkinsPluginProfile(MetroSkinsDemo.class.getName(), false));

        // 临时用户申请接口
        list.add(new ASLPPluginProfile("applyTempUser", AslpApplyTempUser.class.getName(),"外部申请临时账号",new HttpASLP(HttpASLP.AUTH_KEY,"AwsDev")));
        // 信息发布接口
        list.add(new ASLPPluginProfile("applyNotice", AslpCreateNoticeProcess.class.getName(),"信息发布",new HttpASLP(HttpASLP.AUTH_KEY,"AwsDev")));

        return list;
    }
}