package com.awspaas.user.apps.devcase.tempUser.job;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.schedule.IJob;
import com.actionsoft.sdk.local.SDK;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

public class AutoRemoveTempUser implements IJob {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        // 获取未关闭账户数据
        List<BO> tempUser_list = SDK.getBOAPI().query("BO_EU_TEMPUSER").addQuery("ISREMOVE=","0").addQuery("ACTIVATETIME IS NOT NULL",null).list();
        // 获取当前时间
        long nowDate = Calendar.getInstance().getTimeInMillis();
        long month = Long.parseLong(String.valueOf(3*24*6*6)+"000000");
        // 日期格式化
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(BO tempUser : tempUser_list){
            try {
                // 账号创建激活时间
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(simpleDateFormat.parse(tempUser.getString("ACTIVATETIME")));
                long createDate = calendar.getTimeInMillis();
                // 期限时间
                long limitTime = Long.parseLong(tempUser.getString("LIMITTIME"));
                if (nowDate - createDate > limitTime + month) {
                    if(nowDate - createDate > limitTime && nowDate - createDate < limitTime+ month){
                        SDK.getORGAPI().disabledUser(tempUser.getString("UID"));
                    }else {
                        SDK.getORGAPI().removeUser(tempUser.getString("UID"));
                        tempUser.set("ISREMOVE", "1");
                    }
                    SDK.getBOAPI().update("BO_EU_TEMPUSER", tempUser);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
