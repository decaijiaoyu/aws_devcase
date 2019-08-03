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
        // 创建或新增浏览记录
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            String[] ids = ids_String.split(",");
            String uid = userContext.getUID();
            String userName = userContext.getUserName();
            String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            BOAPI boapi = SDK.getBOAPI();
            // 个人浏览记录-新增浏览记录或更新浏览次数
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
                    bo.set("CHECKUSERNAME", userName);
                    bo.set("CHECKUSERID", uid);
                    bo.set("INFOID", id);
                    bo.set("LASTBROWSETIME", time);
                    bo.set("TIMES", times + 1);
                    boapi.createDataBO("bo_eu_info_history", bo, userContext);
                }
                // 通知公告记录 浏览次数+1
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
        // 公告发布
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
        // 公告关闭
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
        // 创建公告流程
        ResponseObject responseObject;
        try {
            responseObject = ResponseObject.newOkResponse();
            if (map.get("uid") != null &&
                    map.get("drange") != null &&
                    map.get("type") != null &&
                    map.get("title") != null &&
                    (map.get("content") != null || map.get("dFix") != null)) {
                // 传入数据不为空时，创建流程
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

                // 部门ID处理
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

                bo.set("ISSUEDRANGE", dnames);// 发布范围部门
                bo.set("ISSUERANGEID", dids);// 发布范围部门ID

                // 创建流程
                ProcessInstance processInstance = SDK.getProcessAPI().createProcessInstance("obj_e026881d92c24decaa1f16ea9fcd29b7", uid, userModel.getUserName() + "发布的信息");

                if (map.get("content") != null) {
                    // 写入内容
                    String content = map.get("content").toString();
                    bo.set("CONTENT", content);
                }
                if (map.get("dFix") != null) {
                    // 创建数据
                    SDK.getBOAPI().create("bo_eu_info", bo, processInstance, UserContext.fromUID(uid));
                    // 开始流程任务
                    SDK.getProcessAPI().start(processInstance);
                    // 获取新建的数据
                    bo = SDK.getBOAPI().getByKeyField("bo_eu_info", "BINDID", processInstance.getId());
                    // 拼接文件存放路径
                    String localPath = new File("").getCanonicalPath().replace(File.separator + "bin", "") + File.separator +
                            "tempFile" + File.separator +
                            "notice" + File.separator +
                            "aslp" + File.separator +
                            processInstance.getId() + File.separator;

                    // 获取附件信息
                    String dFix = map.get("dFix").toString();
                    // 格式转换为json数组
                    JSONArray jsonArray = JSONArray.fromObject(dFix);

                    DownloadFile downloadFile = DownloadFile.getInstance();
                    for (int json_i = 0; json_i < jsonArray.size(); json_i++) {
                        // 遍历获取附件信息
                        JSONObject jsonObject = jsonArray.getJSONObject(json_i);
                        if (jsonObject.get("url") != null && (jsonObject.get("url").toString().length() > 0)
                                && jsonObject.get("fileName") != null && (jsonObject.get("fileName").toString().length() > 0)) {
                            // 附件下载连接和文件名不为空时，数据处理
                            String url = jsonObject.get("url").toString();
                            String fileName = jsonObject.get("fileName").toString();
                            // 先下载文件
                            File file = downloadFile.downloadNet(url, fileName, localPath);
                            // 使用平台的附件存储数据处理类
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
                            // 获取输入数据流
                            InputStream inputStream = new FileInputStream(file);
                            try {
                                // 上传文件到新建的数据
                                SDK.getBOAPI().upFile(formFileModel, inputStream);
                            } catch (Exception e) {
                                e.printStackTrace();
                            } finally {
                                inputStream.close();
                            }
                        }
                    }
                }
                // 第一节点自动完成提交
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

    /**
     * 公告预览
     * @param userContext
     * @param id
     * @return
     */
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
            // 获取附件信息
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
        // 获取公告操作记录
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
        // 获取浏览记录
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
        // 创建操作记录信息
        BO bo = new BO();
        bo.set("NOTICEID", id);
        bo.set("NOTICEOPTION", option);
        SDK.getBOAPI().createDataBO("bo_eu_info_oplog", bo, userContext);
    }

}
