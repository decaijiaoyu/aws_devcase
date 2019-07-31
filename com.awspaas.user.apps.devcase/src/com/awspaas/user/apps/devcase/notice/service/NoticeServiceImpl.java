package com.awspaas.user.apps.devcase.notice.service;

import com.actionsoft.bpms.bo.engine.BO;
import com.actionsoft.bpms.bpmn.engine.model.run.delegate.ProcessInstance;
import com.actionsoft.bpms.commons.formfile.model.FormFileModel;
import com.actionsoft.bpms.commons.formfile.model.delegate.FormFile;
import com.actionsoft.bpms.commons.mvc.view.ResponseObject;
import com.actionsoft.bpms.org.model.DepartmentModel;
import com.actionsoft.bpms.org.model.UserModel;
import com.actionsoft.bpms.server.UserContext;
import com.actionsoft.bpms.server.fs.DCContext;
import com.actionsoft.sdk.local.SDK;
import com.actionsoft.sdk.local.api.BOAPI;
import com.awspaas.user.apps.devcase.util.DownloadFile;
import com.awspaas.user.apps.devcase.util.WebPage;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NoticeServiceImpl implements NoticeService {
    @Override
    public ResponseObject createOrUpdateBRecords(UserContext userContext, String ids_String) {
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            String[] ids = ids_String.split(",");
            String uid = userContext.getUID();
            String usernmae = userContext.getUserName();
            String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            BOAPI boapi = SDK.getBOAPI();
            // 个人浏览记录
            for (String id : ids) {
                List<BO> bos = boapi
                        .query("bo_eu_info_history")
                        .addQuery("INFOID = ", id)
                        .addQuery("CHECKUSERID =", uid)
                        .list();

                int times = 0;

                if (bos.size() > 0) {
                    BO bo = bos.get(0);
                    bo.set("LASTBROWSETIME", time);
                    if (bo.get("TIMES") != null && !bo.getString("TIMES").equals("")) {
                        times = Integer.parseInt(bo.getString("TIMES"));
                    }
                    bo.set("TIMES", times + 1);
                    boapi.update("bo_eu_info_history", bo);
                } else {
                    BO bo = new BO();
                    bo.set("CHECKUSERNAME", usernmae);
                    bo.set("CHECKUSERID", uid);
                    bo.set("INFOID", id);
                    bo.set("LASTBROWSETIME", time);
                    bo.set("TIMES", times + 1);
                    boapi.createDataBO("bo_eu_info_history", bo, userContext);
                }
                // 通知公告记录
                BO main_bo = boapi.get("bo_eu_info", id);
                if (main_bo.get("TIMES") != null && !main_bo.getString("TIMES").equals("")) {
                    times = Integer.parseInt(main_bo.getString("TIMES"));
                } else {
                    times = 0;
                }
                main_bo.set("TIMES", times + 1);
                boapi.update("bo_eu_info", main_bo);
            }

        } catch (Exception e) {
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse(e.getMessage());
        }
        return responseObject;
    }

    @Override
    public ResponseObject releaseNotice(UserContext userContext, String ids) {
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            String[] id_arry = ids.split(",");
            for (String id : id_arry) {
                BO bo = SDK.getBOAPI().get("bo_eu_info", id);
                bo.set("ISSUESTATE", "正式发布");
                SDK.getBOAPI().update("bo_eu_info", bo);
                createOptionLog(userContext, id, "发布");
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse(e.getMessage());
        }
        return responseObject;
    }

    @Override
    public ResponseObject closeNotice(UserContext userContext, String ids) {
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            String[] id_arry = ids.split(",");
            for (String id : id_arry) {
                BO bo = SDK.getBOAPI().get("bo_eu_info", id);
                bo.set("ISSUESTATE", "关闭");
                SDK.getBOAPI().update("bo_eu_info", bo);
                createOptionLog(userContext, id, "关闭");
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse(e.getMessage());
        }
        return responseObject;
    }

    @Override
    public ResponseObject createNoticeProcess(Map<String, Object> map) {
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            if (map.get("uid") != null &&
                    map.get("drange") != null &&
                    map.get("type") != null &&
                    map.get("title") != null &&
                    (map.get("content") != null || map.get("dFix") != null)) {
                BO bo = new BO();
                String uid = map.get("uid").toString();// 用户id
                String dranges = map.get("drange").toString();// 发布范围
                String type = map.get("type").toString();// 类型
                String title = map.get("title").toString();// 标题

                UserModel userModel = SDK.getORGAPI().getUser(uid);
                DepartmentModel departmentModel = SDK.getORGAPI().getDepartmentById(userModel.getDepartmentId());
                bo.set("ISSUESTATE", "待审核");
                bo.set("ISSUEDEPTID", userModel.getDepartmentId());
                bo.set("ISSUEDEPTNAME", departmentModel.getName());
                bo.set("ISSUETYPE", type);
                bo.set("TITLE", title);

                String[] drangeids = dranges.split(",");
                String dids = "";
                String dnames = "";
                for (String did : drangeids) {
                    if (!dids.contains(did)) {
                        departmentModel = SDK.getORGAPI().getDepartmentById(did);
                        dids += did + ",";
                        dnames += departmentModel.getName() + ",";
                    }
                }
                if (dids.length() > 0) {
                    dids = dids.substring(0, dids.length() - 1);
                }
                if (dnames.length() > 0) {
                    dnames = dnames.substring(0, dnames.length() - 1);
                }

                bo.set("ISSUEDRANGE", dnames);
                bo.set("ISSUERANGEID", dids);

                ProcessInstance processInstance = SDK.getProcessAPI().createProcessInstance("obj_e026881d92c24decaa1f16ea9fcd29b7", uid, userModel.getUserName() + "发布的信息");

                if (map.get("content") != null) {
                    String content = map.get("content").toString();
                    bo.set("CONTENT", content);
                }
                if (map.get("dFix") != null) {
                    SDK.getBOAPI().create("bo_eu_info", bo, processInstance, UserContext.fromUID(uid));
                    SDK.getProcessAPI().start(processInstance);
                    bo = SDK.getBOAPI().getByKeyField("bo_eu_info", "BINDID", processInstance.getId());
                    String localPath = new File("").getCanonicalPath().replace(File.separator + "bin", "") + File.separator +
                            "tempFile" + File.separator +
                            "notice" + File.separator +
                            "aslp" + File.separator +
                            processInstance.getId() + File.separator;

                    String dFix = map.get("dFix").toString();
                    JSONArray jsonArray = JSONArray.fromObject(dFix);

                    DownloadFile downloadFile = DownloadFile.getInstance();
                    for (int json_i = 0; json_i < jsonArray.size(); json_i++) {
                        JSONObject jsonObject = jsonArray.getJSONObject(json_i);
                        if (jsonObject.get("url") != null && (jsonObject.get("url").toString().length() > 0)
                                && jsonObject.get("fileName") != null && (jsonObject.get("fileName").toString().length() > 0)) {
                            String url = jsonObject.get("url").toString();
                            String fileName = jsonObject.get("fileName").toString();
                            File file = downloadFile.downloadNet(url, fileName, localPath);
                            FormFileModel formFileModel = new FormFileModel();
                            formFileModel.setAppId("com.awspaas.user.apps.devcase");
                            formFileModel.setBoId(bo.getId());
                            formFileModel.setBoItemName("FILE");
                            formFileModel.setBoName("bo_eu_info");
                            formFileModel.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));
                            formFileModel.setCreateUser(uid);
                            formFileModel.setFileName(fileName);
                            formFileModel.setFileSize(file.length());
                            formFileModel.setProcessInstId(processInstance.getId());
                            formFileModel.setTaskInstId(processInstance.getStartTaskInstId());
                            formFileModel.setRemark("请求接口上传的文件");
                            InputStream inputStream = new FileInputStream(file);
                            try {
                                SDK.getBOAPI().upFile(formFileModel, inputStream);
                            } catch (Exception e) {
                                e.printStackTrace();
                            } finally {
                                inputStream.close();
                            }
                        }
                    }
                }
                SDK.getTaskAPI().completeTask(processInstance.getStartTaskInstId(), uid);
                responseObject.msg("信息发布流程成功启动");
            } else {
                responseObject = ResponseObject.newErrResponse("请求失败：信息不完整，请检查");
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject = ResponseObject.newErrResponse("请求失败：信息错误，请检查");
        }
        return responseObject;
    }

    @Override
    public String browseNotice(UserContext userContext, String id) {
        String AppId = "com.awspaas.user.apps.devcase";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id", id);
        map.put("sid", userContext.getSessionId());
        try {
            BO bo = SDK.getBOAPI().query("bo_eu_info", true).detailById(id);
            map.put("title", bo.get("TITLE"));
            map.put("content", bo.get("CONTENT"));
            List<FormFile> formFiles = SDK.getBOAPI().getFiles(id, "FILE");
            String files = "<table class='awsui-table awsui-table-hover'>" +
                    "<thead>" +
                    "<tr>" +
                    "<th>附件</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";
            for (FormFile formFile : formFiles) {
                DCContext dcContext = SDK.getBOAPI().getFileDCContext(formFile);
                String downUrl = dcContext.getDownloadURL();
                String fileName = dcContext.getFileName();
                files += "<tr>" +
                        "<td onclick='window.open(" + '"' + downUrl + '"' + ")'>" +
                        fileName +
                        "</td>" +
                        "</tr>";
            }
            files += "</tbody></table>";
            map.put("files", files);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("errorInfo", "读取数据异常");
            return WebPage.getPage(AppId, "ErrorPage.html", map);
        }
        return WebPage.getPage(AppId, "notice-info.html", map);
    }

    @Override
    public String getOptionLogNotice(UserContext userContext, String id) {
        String AppId = "com.awspaas.user.apps.devcase";
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<BO> bos = SDK.getBOAPI().query("bo_eu_info_oplog").addQuery("NOTICEID=", id).list();
            String option_table = "<table class='awsui-table awsui-table-hover'>" +
                    "<thead>" +
                    "<tr>" +
                    "<th>操作人</th>" +
                    "<th>操作人ID</th>" +
                    "<th>操作时间</th>" +
                    "<th>操作</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";
            for (BO bo : bos) {
                String uid = bo.getCreateUser();
                String userName = SDK.getORGAPI().getUserNames(uid);
                String createDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(bo.getCreateDate());
                String noticOption = bo.getString("NOTICEOPTION");
                option_table += "<tr>" +
                        "<td>" + userName + "</td>" +
                        "<td>" + uid + "</td>" +
                        "<td>" + createDate + "</td>" +
                        "<td>" + noticOption + "</td>" +
                        "</tr>";
            }
            option_table += "</tbody></table>";
            map.put("title", "公告操作记录");
            map.put("optionTable", option_table);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("errorInfo", "读取数据异常");
            return WebPage.getPage(AppId, "ErrorPage.html", map);
        }
        return WebPage.getPage(AppId, "notice-oplog.html", map);
    }


    @Override
    public String getBrowseRecords(UserContext userContext, String id) {
        String AppId = "com.awspaas.user.apps.devcase";
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<BO> bos = SDK.getBOAPI().query("BO_EU_INFO_HISTORY").addQuery("INFOID=", id).list();
            String option_table = "<table class='awsui-table awsui-table-hover'>" +
                    "<thead>" +
                    "<tr>" +
                    "<th>浏览人</th>" +
                    "<th>浏览人ID</th>" +
                    "<th>最近一次浏览时间</th>" +
                    "<th>浏览次数</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";
            for (BO bo : bos) {
                String uid = bo.getString("CHECKUSERID");
                String userName = bo.getString("CHECKUSERNAME");
                String lastBrowseTime = bo.getString("LASTBROWSETIME");
                String times = bo.getString("TIMES");
                option_table += "<tr>" +
                        "<td>" + userName + "</td>" +
                        "<td>" + uid + "</td>" +
                        "<td>" + lastBrowseTime + "</td>" +
                        "<td>" + times + "</td>" +
                        "</tr>";
            }
            option_table += "</tbody></table>";
            map.put("title", "浏览记录");
            map.put("optionTable", option_table);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("errorInfo", "读取数据异常");
            return WebPage.getPage(AppId, "ErrorPage.html", map);
        }
        return WebPage.getPage(AppId, "notice-oplog.html", map);
    }

    private void createOptionLog(UserContext userContext, String id, String option) throws Exception {
        BO bo = new BO();
        bo.set("NOTICEID", id);
        bo.set("NOTICEOPTION", option);
        SDK.getBOAPI().createDataBO("bo_eu_info_oplog", bo, userContext);
    }

    public static void main(String[] args) {
        Map<String, Object> map = new HashMap<>();
        map.put("uid", "admin");
        map.put("drange", "评估试用版");
        map.put("type", "通知");
        map.put("title", "text");
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("url", "http://hbimg.b0.upaiyun.com/0b0a64f995cbdeb4428f761d0f1aa6bd97c288d3912b-OcHDCs_fw658");
        jsonObject.put("fileName", "图片1.png");
        jsonArray.add(jsonObject);
        jsonObject.put("url", "http://hbimg.b0.upaiyun.com/0b0a64f995cbdeb4428f761d0f1aa6bd97c288d3912b-OcHDCs_fw658");
        jsonObject.put("fileName", "图片2.png");
        jsonArray.add(jsonObject);
        map.put("dFix", jsonArray);
        NoticeServiceImpl noticeService = new NoticeServiceImpl();
        noticeService.createNoticeProcess(map);
    }
}
