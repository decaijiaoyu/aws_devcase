function browse(id) {
    var sid = $("#sid").val();
    FrmDialog.open({
        width: 800,
        height: 700,
        url: "./w",
        data: {
            sid: sid,
            cmd: "com.awspaas.user.apps.devcase_notice_browse",
            id: id
        }
    });
}

function openLog(id) {
    var sid = $("#sid").val();
    FrmDialog.open({
        width: 800,
        height: 700,
        url: "./w",
        data: {
            sid: sid,
            cmd: "com.awspaas.user.apps.devcase_notice_optionlog",
            id: id
        }
    });
}

function openBrowseLog(id) {
    var sid = $("#sid").val();
    FrmDialog.open({
        width: 800,
        height: 700,
        url: "./w",
        data: {
            sid: sid,
            cmd: "com.awspaas.user.apps.devcase_notice_Browselog",
            id: id
        }
    });
}