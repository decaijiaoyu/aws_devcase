package com.awspaas.user.apps.devcase.tempUser.service;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.model.run.delegate.ProcessInstance;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.server.UserContext;
import com.actionsoft.bpms.util.DBSql;
import com.actionsoft.sdk.local.SDK;

import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Map;

public class CreateTempUserImpl implements CreateTempUser {

    @Override
    public String createFormNo(String preFix) throws Exception {
        // 创建临时账号申请单编号
        // 内部preFix：IN 外部preFix：EX
        String formNo = "";
        Calendar calendar = Calendar.getInstance();

        String ymd = calendar.get(Calendar.YEAR) + "-" + (calendar.get(Calendar.MONTH) + 1 < 10 ? "0" + (calendar.get(Calendar.MONTH) + 1) : (calendar.get(Calendar.MONTH) + 1)) + "-" + calendar.get(Calendar.DAY_OF_MONTH);
        // 获取前缀相同 每日申请的数据量
        String max_No = DBSql.getString("SELECT NUM FROM BO_EU_TEMPUSER_DAYAPPLY WHERE PreFix = '"+preFix+"' AND TIMESTAMPDIFF(DAY,CREATEDATE,'"+ymd+"') = 0;", "NUM");

        // 初始编号为1
        int max_No_int = 1;
        // 最小6位补齐数据
        String No_zero = "000000";
        DecimalFormat decimalFormat = null;
        String[] sqls = new String[1];

        if (max_No != null && !max_No.equals("")) {
            // 有最大值时，数据转换为int+1
            max_No_int = Integer.parseInt(max_No) + 1;
            // 转换字符串，如果字符串长度超过6位，补0位
            max_No = String.valueOf(max_No_int);
            for (int l = 6; l < max_No.length(); l++) {
                // 长度大于6时，自增0位
                No_zero = No_zero + "0";
            }
        } else {
            //不需要数据处理的直接新增每日申请数据单据
            BO dayapply = new BO();
            dayapply.set("NUM", 1);
            dayapply.set("PREFIX", preFix);
            SDK.getBOAPI().createDataBO("BO_EU_TEMPUSER_DAYAPPLY", dayapply, UserContext.fromUID("admin"));
        }
        // 格式处理
        decimalFormat = new DecimalFormat(No_zero);
        max_No = decimalFormat.format(max_No_int);
        // 拼接单号
        formNo = preFix + ymd.replace("-", "") + max_No;
        sqls[0] = "UPDATE BO_EU_TEMPUSER_DAYAPPLY SET NUM = '" + max_No + "' WHERE PreFix = '" + preFix + "' AND CreateDate like '" + ymd + "%'";
        DBSql.batch(sqls);
        return formNo;
    }

    @Override
    public String createTempUserId() throws Exception {
        // 生成临时账号
        // 获取已经生成临时账号ID的最大值
        String max_uid = DBSql.getString("SELECT UID FROM BO_EU_TEMPUSER WHERE UID !='' ORDER BY UID DESC LIMIT 1", "UID");
        // 初始为1
        int max_uid_int = 1;
        // 6位0补齐
        String uid_zero = "000000";
        DecimalFormat decimalFormat = null;
        if (max_uid != null && !max_uid.equals("")) {
            // 格式处理+1
            max_uid = max_uid.substring(2,max_uid.length());
            max_uid_int = Integer.parseInt(max_uid) + 1;
            max_uid = String.valueOf(max_uid_int);
            for (int l = 6; l < max_uid.length(); l++) {
                // 长度大于6时，自增0位
                uid_zero = uid_zero + "0";
            }
        }
        decimalFormat = new DecimalFormat(uid_zero);

        max_uid = decimalFormat.format(max_uid_int);
        return max_uid;
    }

    @Override
    public String createTempUserPassword(String idCard) throws Exception {
        // 根据身份证号生成密码 出生年月日8位
        return idCard.substring(6, 14);
    }

    @Override
    public ResponseObject createProcess(Map<String, Object> map) {
        // 创建流程-ASLP调用
        ResponseObject responseObject = ResponseObject.newOkResponse();
        try {
            String userName = map.get("USERNAME").toString();
            String idCard = map.get("IDCARD").toString();
            String reason = map.get("REASON").toString();
            String time = map.get("TIME").toString();
            String unit = map.get("UNIT").toString();

            // 创建流程数据明细，并返回单号
            String formNo = this.createProcessDetail(userName,idCard,reason,time,unit);

            responseObject.put("FORMNO", formNo);
        } catch (Exception e) {
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse(e.getMessage());
        }
        return responseObject;
    }

    private String createProcessDetail(String userName,String idCard,String reason,String time,String unit) throws Exception{
        // 创建数据详细处理
        BO tempUserBo = new BO();

        tempUserBo.set("USERNAME", userName);
        tempUserBo.set("IDCARD", idCard);
        tempUserBo.set("REASON", reason);
        tempUserBo.set("TIMESIZE", time);
        tempUserBo.set("TIMEUNIT", unit);
        String formNo = this.createFormNo("EX");
        tempUserBo.set("FORMNO", formNo);

        ProcessInstance processInstance = SDK.getProcessAPI().createProcessInstance("obj_6ae25b5bcb734d678bc14b5a0c9d0327", "admin", userName + "申请临时账号");
        SDK.getBOAPI().create("BO_EU_TEMPUSER", tempUserBo, processInstance, UserContext.fromUID("admin"));
        SDK.getProcessAPI().start(processInstance);
        SDK.getTaskAPI().completeTask(processInstance.getStartTaskInstId(), "admin");

        return formNo;
    }
}
