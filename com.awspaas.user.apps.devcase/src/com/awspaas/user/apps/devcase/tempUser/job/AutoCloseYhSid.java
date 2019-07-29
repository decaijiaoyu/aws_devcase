package com.awspaas.user.apps.devcase.tempUser.job;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.schedule.IJob;
import com.actionsoft.sdk.local.SDK;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.util.List;

public class AutoCloseYhSid implements IJob {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        List<BO>  yhsid_bos = SDK.getBOAPI()
                .query("bo_eu_yh_sid")
                .addQuery("ISCLOSED = ","")
                .addQuery("ISUSED = ","0")
                .list();
        long now_long = System.currentTimeMillis();
        long day_long = Long.parseLong(24*6*6+"00000");
        for (BO bo:yhsid_bos){
            if(bo.get("ACTIVATETIME")!=null&&bo.getString("ACTIVATETIME").length()>0){
                long activateTime = Long.parseLong(bo.getString("ACTIVATETIME"));
                if(now_long-day_long>activateTime){
                    bo.set("ISCLOSED","1");
                    SDK.getBOAPI().update("bo_eu_yh_sid",bo);
                }

            }
        }

    }
}
