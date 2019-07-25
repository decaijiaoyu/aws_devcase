package com.awspaas.user.apps.devcase;

import com.actionsoft.apps.listener.PluginListener;
import com.actionsoft.apps.resource.AppContext;
import com.actionsoft.apps.resource.plugin.profile.AWSPluginProfile;
import com.actionsoft.apps.resource.plugin.profile.SkinsPluginProfile;
import com.awspaas.user.apps.devcase.metroskins.MetroSkinsDemo;

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
        return list;
    }
}