$(document).ready(function() {
    var bgImgPath = '../apps/com.actionsoft.apps.skins.metro/img/bg_';
    var defaultWidth;
    var minisize = 50;
    // 设置背景图片
    if (specificBackGround && specificBackGround != '') {
        $('#metro-bg-img').attr('src', '../apps/com.actionsoft.apps.skins.metro/img/' + specificBackGround);
    } else {
        $('#metro-bg-img').attr('src', bgImgPath + metroBackGround + '_big.jpg');
    }

    // 主导航
    var initNavSystem = function() {
        var navPanel = $('.metro-nav-container'); // 普通菜单域
        var headPanel = $('.metro-nav-panel'); // 置顶菜单域
        defaultWidth = headPanel.width();
        var len = navSystemList.length;
        for (var i = 0; i < len; i++) {

            // 系统获取
            var navSystem = navSystemList[i];

            // 系统菜单渲染
            var _sysNavPanel = $('<div class="metro-nav-area-panel"></div>')

            if (navSystem['id'] == navHomePageId) { // 主页
                _sysNavPanel = $('<div class="metro-nav-area-panel metro-nav-home-panel"></div>');
            }

            // 菜单其他属性渲染
            _sysNavPanel.attr('navSysId', navSystem['id']); // 菜单id
            _sysNavPanel.attr('target', navSystem['target']); // 打开方式
            _sysNavPanel.attr('url', navSystem['url']); // 菜单地址

            // 未知设置
            if (notPresentFuncAppId != '' && navSystem['appId'] != '' && notPresentFuncAppId.indexOf(navSystem['appId']) >= 0) {
                _sysNavPanel.attr('url', "");
            }

            //如果是首页，固定子导航上面，不给移动
            if (navSystem['id'] == navHomePageId) {
                headPanel.append(_sysNavPanel);
            } else {
                navPanel.append(_sysNavPanel);
            }

            // 图标渲染
            var _icon = "";
            if (navSystem['icon64'] == '') {
                _icon = '<img class="metro-nav-img" src="../apps/com.actionsoft.apps.skins.metro/img/icon64.png" title="' +
                    navSystem['name'] + ' "></img>';
            } else {
                _icon = '<img class="metro-nav-img" src="' + navSystem['icon64'] + '" title="' + navSystem['name'] + '"></img>';
            }

            // 标签内容渲染
            if (navSystem['id'] == navHomePageId) {
                var tab = $('<table border="0"><tr><td>' + _icon +
                    '</td><td align="left" class="nav-name"><span class="metro-nav-area-name">' + navSystem['name'] +
                    '</span></td></tr></table>');
            } else if (navSystem['id'] == "obj_0c66b23c2cb54a8496970dfec3320d71" || navSystem['id'] == "obj_392c2a82450d4e9285eb6719714b49e0" || navSystem['id'] == "obj_58d7db58e62448339de7077ed813f33d" || navSystem['id'] == "obj_4b20c4043acb4f49a897a7c04a7e8205" || navSystem['id'] == "obj_fec4f680685943428c788eafaff2e73b") {
                var tab = $('<table border="0"><tr><td>' + _icon +
                    '</td><td align="left" class="nav-name"><span class="metro-nav-area-name">' + navSystem['name'] +
                    '</span></td><td align="left" class="nav-name"><img src="../apps/com.actionsoft.apps.skins.metro/img/rnew.png"></img></td></tr></table>');
            } else {
                var tab = $('<table border="0"><tr><td>' + _icon +
                    '</td><td align="left" class="nav-name"><span class="metro-nav-area-name">' + navSystem['name'] +
                    '</span></td></tr></table>');
            }

            _sysNavPanel.append(tab);
        }

        // 访问历史处理
        var _HistoryPanel = $('<div class="metro-nav-area-panel metro-nav-home-panel"></div>');
        // 菜单其他属性渲染
        _HistoryPanel.attr('navSysId', 'obj_history'); // 菜单id
        _HistoryPanel.attr('target', ''); // 打开方式
        _HistoryPanel.attr('url', ''); // 菜单地址
        var tab = $('<table border="0"><tr><td><img class="metro-nav-img" src="../apps/com.actionsoft.apps.skins.metro/img/his64.png" title="访问历史"></img></td><td align="left" class="nav-name"><span class="metro-nav-area-name">访问历史</span></td></tr></table>');
        headPanel.append(_HistoryPanel);
        _HistoryPanel.append(tab);

        // 给子系统菜单导航绑定事件
        renderNavSysEvent();

        //给“首页”子系统菜单导航绑定事件
        renderNavSysEventSy();

        // 重新定义上下翻动
        renderNavSystemPanel();

        // 这里绑定菜单栏目的鼠标滚动时间
        $('.metro-nav-container').mousewheel(function(event, delta, deltaX, deltaY) {
            try {
                delta == 1 ? $(".metro-nav-system-move-up").mousedown() :
                    $('.metro-nav-system-move-down').mousedown();
            } catch (e) {

            }
        });
    };
    var renderNavSystemPanel = function() {
        var move_up = $(".metro-nav-panel").children('.metro-nav-system-move-up'); // 向上
        var move_down = $(".metro-nav-panel").children('.metro-nav-system-move-down'); // 向下
        var navigate_main = $('.metro-nav-out-container'); // 外容器
        var navigate_move = $('.metro-nav-out-container').children('.metro-nav-container'); // 内容器，被移动的

        var start_top = navigate_move.offset().top; // 初始距离窗口上方的高度
        var step = 72 * 3; // 移动一个子系统
        var moveable = true; // 是否允许移动
        var move_height = 0; // 移动的高度
        // 绑定事件，往下图标，往上移动
        $(move_down).mousedown(function(e) {
            if (!moveable) return false;
            var nav_height = $(navigate_main).height();
            var top = $(navigate_move).offset().top;
            var ul_height = $(navigate_move).height();
            if (ul_height - move_height - nav_height > step) {
                moveable = false;
                $(navigate_move).animate({
                    'margin-top': "-=" + step + "px"
                }, 'normal', null, function() {
                    moveable = true;
                });
                $(this).show();
                $(move_up).show();
                move_height += step;
            } else if (ul_height - move_height - nav_height >= 0) {
                moveable = false;
                $(navigate_move).animate({
                    'margin-top': '-=' + (ul_height + top - start_top - nav_height) + 'px'
                }, 'normal', null, function() {
                    moveable = true;
                });
                $(this).hide();
                move_up.show();
                move_height += ul_height - move_height - nav_height;
            }
        });
        // 绑定事件，往上图标，向下移动
        $(move_up).mousedown(function(e) {
            if (!moveable) return false;
            var top = $(navigate_move).offset().top;
            if (move_height > step) {
                moveable = false;
                $(navigate_move).animate({
                    'margin-top': "+=" + (step) + "px"
                }, 'normal', null, function() {
                    moveable = true;
                });
                $(this).show();
                move_down.show();
                move_height -= step;
            } else if (move_height > 0) {
                moveable = false;
                $(this).hide();
                move_down.show();
                $(navigate_move).animate({
                    'margin-top': '+=' + (move_height) + 'px'
                }, 'normal', null, function() {
                    moveable = true;
                });
                move_height = 0;
            }
        });
        resetNavSystem();
    };
    // 重新设置往下移动图标
    var resetNavSystem = window.resetNavSystem = function() {
        var navigate_main = $('.metro-nav-out-container'); // 外容器
        var navigate_move = $('.metro-nav-out-container').children('.metro-nav-container'); // 内容器，被移动的
        navigate_move.attr('margin-top', 0);
        $(".metro-nav-panel").children('.metro-nav-system-move-up').hide();
        if (navigate_move.height() > navigate_main.height()) {
            $(".metro-nav-panel").children('.metro-nav-system-move-down').show();
        } else {
            $(".metro-nav-panel").children('.metro-nav-system-move-down').hide();
        }
    };
    // 给“首页”子系统菜单导航绑定事件
    var renderNavSysEventSy = function() {
        $('.metro-nav-panel').children('.metro-nav-area-panel').unbind('click').bind('click', function(e) {
            if ($(this).hasClass('current')) { // 再次点击选中的子系统菜单，隐藏二级导航面板
                $('.metro-nav-dir-container').hide();
                $(this).removeClass('current');
                if ($('.metro-mainframe-panel').css('display') == 'none')
                    $('.metro-nav-lock-container').fadeIn();
                else $('.metro-nav-lock-container').hide();
                return;
            }
            $('.metro-nav-area-panel.current').removeClass('current');
            $(this).addClass('current');
            //$('#metroNavDirTitle').text($(this).children('.metro-nav-area-name').text());
            $('#metroNavDirTitle').text($(this).text());
            var navSysId = $(this).attr('navSysId');
            var url = $(this).attr('url');
            var target = $(this).attr('target');
            // 展开二级导航条
            if (url == '' || url == '/' || url == '/test' || url == 'test') {
                // 显示二级导航面板
                $('.metro-nav-dir-container').fadeIn();
                $(document).off("click.close").on("click.close", function(e) {
                    $('.metro-nav-dir-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                });
                $('.metro-mainframe-panel').off("click.close").on("click.close", function(e) {
                    $('.metro-nav-dir-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                });
                loadNavDirFunc(navSysId); // 获取二级导航菜单
            } else {
                if (target == '_blank') {
                    $('.metro-nav-area-panel.current').removeClass('current');
                    window.open(url); // 打开新的窗口
                } else {
                    // 在Metro中打开
                    var name = $(this).find('.metro-nav-area-name').text();
                    showFunctionWindow(navSysId, name, url);
                    getLock(); // 锁定
                    $('.metro-nav-lock-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                }
                $('.metro-nav-dir-container').hide();
            }
            $('#navSearch').focus().val('');
        });
    };
    // 给子系统菜单导航绑定事件
    var renderNavSysEvent = function() {
        $('.metro-nav-container').children('.metro-nav-area-panel').unbind('click').bind('click', function(e) {
            if ($(this).hasClass('current')) { // 再次点击选中的子系统菜单，隐藏二级导航面板
                $('.metro-nav-dir-container').hide();
                $(this).removeClass('current');
                if ($('.metro-mainframe-panel').css('display') == 'none')
                    $('.metro-nav-lock-container').fadeIn();
                else $('.metro-nav-lock-container').hide();
                return;
            }
            $('.metro-nav-area-panel.current').removeClass('current');
            $(this).addClass('current');
            //$('#metroNavDirTitle').text($(this).children('.metro-nav-area-name').text());
            $('#metroNavDirTitle').text($(this).text());
            var navSysId = $(this).attr('navSysId');
            var url = $(this).attr('url');
            var target = $(this).attr('target');
            // 展开二级导航条
            if (url == '' || url == '/' || url == '/test' || url == 'test') {
                // 显示二级导航面板
                $('.metro-nav-dir-container').fadeIn();
                $(document).off("click.close").on("click.close", function(e) {
                    $('.metro-nav-dir-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                });
                $('.metro-mainframe-panel').off("click.close").on("click.close", function(e) {
                    $('.metro-nav-dir-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                });
                loadNavDirFunc(navSysId); // 获取二级导航菜单
            } else {
                if (target == '_blank') {
                    $('.metro-nav-area-panel.current').removeClass('current');
                    window.open(url); // 打开新的窗口
                } else {
                    // 在Metro中打开
                    var name = $(this).children('.metro-nav-area-name').text();
                    showFunctionWindow(navSysId, name, url);
                    getLock(); // 锁定
                    $('.metro-nav-lock-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                }
                $('.metro-nav-dir-container').hide();
            }
            $('#navSearch').focus().val('');
        });
    };
    // 获取二级导航菜单
    var loadNavDirFunc = function(navSysId) {
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_get_dir_func', {
            'navSystemId': navSysId
        }, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                var curSysNavFunc = new Array();
                var metroNavDirFuncContainer = $('.metro-nav-dir-func-container');
                metroNavDirFuncContainer.empty();
                var dirList = responseObject['data']['dirList'];
                var len = dirList.length;



                for (var i = 0; i < len; i++) {
                    // 文件夹菜单
                    navDir = dirList[i];
                    var metroNavDir = $('<div class="metro-nav-dir"></div>');
                    var metroNavDirTitle = $('<span class="name"><span class="name">' + navDir['name'] + '</span>');
                    var metroNavDirSeparate = $('<hr class="metro-nav-separate-line"/>');
                    if (navDir['url'] != '' && navDir['url'] != '/' && navDir['url'] != '/test' && navDir['url'] != 'test') {
                        metroNavDirTitle.addClass('metro-nav-goto');
                        metroNavDirTitle.attr('navId', navDir['id']);
                        metroNavDirTitle.attr('url', navDir['url']);
                        metroNavDirTitle.attr('target', navDir['target']);
                        metroNavDirTitle.attr('appId', navDir['appId']);
                    }
                    curSysNavFunc.push(navDir);
                    metroNavDirFuncContainer.append(metroNavDir);
                    metroNavDir.append(metroNavDirTitle);
                    var navFuncs = navDir['function'];
                    var len_ii = navFuncs.length;
                    // 功能菜单
                    for (var ii = 0; ii < len_ii; ii++) {
                        var navFun = navFuncs[ii];

                        var _icon = "";
                        if (navFun['icon64']) {
                            _icon = '<img   src="' + navFun['icon64'] + '" title="' + navFun['name'] + '"></img>';
                        }
                        var metroNavFunc = $('<span class="metro-nav-func"></span>');
                        var metroNavFuncName = $('<span class="name">' + navFun['name'] + _icon + '</span>');
                        metroNavFunc.addClass('metro-nav-goto');
                        metroNavFunc.attr('navId', navFun['id']);
                        metroNavFunc.attr('url', navFun['url']);
                        metroNavFunc.attr('target', navFun['target']);
                        metroNavFunc.attr('appId', navFun['appId']);
                        metroNavDir.append(metroNavFunc);
                        metroNavFunc.append(metroNavFuncName);
                        curSysNavFunc.push(navFun);
                    }
                    metroNavDir.append(metroNavDirSeparate);
                }
                // 公共门户
                var publicPortletList = responseObject['data']['publicPortletList'];
                if (publicPortletList != null && publicPortletList.length > 0) {
                    var publicPortletTitle = $('<div class="metro-public-portlet-title">小门户</div>');
                    metroNavDirFuncContainer.append(publicPortletTitle);
                    len = publicPortletList.length;
                    for (var i = 0; i < len; i++) {
                        // 公共门户分组
                        var pubGroup = publicPortletList[i];
                        var metroPubGroup = $('<div class="metro-nav-dir"></div>');
                        var metroPubGroupTitle = $('<span class="name"><span class="name">' + (pubGroup['groupName'] == '' ? '未分组' : pubGroup['groupName']) + '</span>');
                        var metroPubGroupSeparate = $('<hr class="metro-nav-separate-line"/>');
                        metroNavDirFuncContainer.append(metroPubGroup);
                        metroPubGroup.append(metroPubGroupTitle).append(metroPubGroupSeparate);
                        // 公共门户功能菜单
                        var portlets = pubGroup['portlets'];
                        var len_ii = portlets.length;
                        // 功能菜单
                        for (var ii = 0; ii < len_ii; ii++) {
                            var portlet = portlets[ii];
                            var _icon = "";
                            if (portlet['icon64']) {
                                _icon = '<img src="' + portlet['icon64'] + '" title="' + portlet['name'] + '"></img>';
                            }

                            var metroPortlet = $('<span class="metro-nav-func"></span>');
                            var metroPortletName = $('<span class="name">' + portlet['name'] + _icon + '</span>');
                            metroPortlet.addClass('metro-nav-goto');
                            metroPortlet.attr('navId', portlet['id']);
                            metroPortlet.attr('url', portlet['url']);
                            metroPortlet.attr('target', portlet['target']);
                            metroPortlet.attr('appId', portlet['appId']);
                            metroPubGroup.append(metroPortlet);
                            metroPortlet.append(metroPortletName);
                            curSysNavFunc.push(portlet);
                        }
                    }
                }
                navArea['AllSysNav'] = curSysNavFunc;
                // 给导航绑定事件
                renderNavDirFuncEvent();
            } else {
                $.simpleAlert(responseObject['msg'], responseObject['result']);
            }
        }, 'json');
    };

    // 给导航绑定事件
    var renderNavDirFuncEvent = function() {
        // 判断是否已添加到Metro桌面
        $('.metro-nav-dir-func-container').find('.metro-nav-goto').each(function(i) {
            // 某一部分app不提供功能页面
            var appId = $(this).attr('appId');
            if (appId != '' && notPresentFuncAppId.indexOf(appId) >= 0) $(this).removeClass('metro-nav-goto');
            var navId = $(this).attr('navId');
            var added = $('.nav-panel').find('#' + navId + ',[func_id="' + navId + '"]').length > 0;
            if (!added) {
                var _add = $('<span class="metro-nav-add"></span>');
                $(this).append(_add);
                _add.click(function(e) {
                    $('.metro-mainframe-panel').hide(); // 隐藏功能主页面
                    $('.metro-nav-lock-container').fadeIn();
                    // 添加
                    var _funcId = $(this).parent().attr('navId');
                    var data = getSysNavData(_funcId);
                    var nav_collection = $('.nav-panel').find('.nav-collection').last(); // 获取最后一个容器
                    // 获取当前容器已渲染的单元数
                    var unitNumel = nav_collection.attr('unitNumel') - 0;
                    // 行个数和列个数
                    var rowNumel = 1;
                    if (isNaN(data['rowNumel'] - 0)) data['rowNumel'] = 1;
                    else rowNumel = data['rowNumel'] - 0;
                    var colNumel = 1;
                    if (isNaN(data['colNumel'] - 0)) data['colNumel'] = 1;
                    else colNumel = data['colNumel'] - 0;
                    var cur_unit = rowNumel * colNumel;
                    if (navArea['size'] - unitNumel < cur_unit) { // 如果容器的剩余单元数不够
                        nav_collection.next().removeClass('turn-none').addClass('turn-next').click(function(e) {
                            turnPage(1);
                        }); // 最后一页的向右翻页图标和事件
                        var _curPage = navArea['pages'];
                        navArea['pages'] = _curPage + 1;
                        nav_collection_panel = nav_collection.parent().clone(); // 克隆面板
                        nav_collection_panel.children().remove(); // 移除子元素
                        nav_collection_panel.attr('id', 'collection-' + _curPage); // 重新设置相关属性
                        nav_collection = nav_collection.clone(); // 克隆容器
                        nav_collection.children().remove(); // 移除子元素
                        nav_collection.attr("pageNo", _curPage + 1).attr("unitNumel", 0); // 重新设置相关属性
                        $('.nav-panel').append(nav_collection_panel);
                        nav_collection_panel.append(nav_collection);
                        if (_curPage != 0) { // 上一页
                            var turn_prev = $('<span class="turn-prev"></span>');
                            nav_collection.before(turn_prev);
                            turn_prev.click(function(e) {
                                turnPage(-1);
                            });
                        } else nav_collection.before('<div class="turn-none">&nbsp;</div>'); // 补白位置
                        if (_curPage != navArea['pages'] - 1 && navArea['pages'] > 1) { // 下一页
                            var turn_next = $('<span class="turn-next"></span>');
                            nav_collection.after(turn_next);
                            turn_next.click(function(e) {
                                turnPage(1);
                            });
                        } else nav_collection.after('<div class="turn-none">&nbsp;</div>'); // 补白位置
                    }
                    createNavArea(data, nav_collection, cur_unit);
                    // 创建分页栏
                    createPagingToolbar();
                    // 跳转到最后一页
                    var step = navArea['pages'] - navArea['curPage'];
                    turnPage(step);
                    $(this).removeClass('metro-nav-add').addClass('metro-nav-added');
                    $(this).unbind('click');
                    saveMetroNav(); // 保存数据
                    e.stopPropagation(); // 阻止事件冒泡
                });
            } else { // 已添加
                var _add = $('<span class="metro-nav-added"></span>');
                $(this).append(_add);
            }
        });
        // 绑定点击事件
        $('.metro-nav-dir-func-container').find('.metro-nav-goto').find('.name').click(function(e) {
            var navId = $(this).parent().attr('navId');
            var url = $(this).parent().attr('url');
            var target = $(this).parent().attr('target');
            var appId = $(this).parent().attr('appId');
            if (checkAppActive(appId)) {
                // 打开链接
                if (target == '_blank') {
                    window.open(url); // 打开新的窗口
                } else {
                    // 在Metro中打开
                    var name = $(this).attr('shortName') ? $(this).attr('shortName') : $(this).text();
                    showFunctionWindow(navId, name, url);
                    getLock(); // 锁定
                    $('.metro-nav-lock-container').hide();
                    $('.metro-nav-dir-container').hide();
                    $('.metro-nav-area-panel.current').removeClass('current');
                }

                // modify by kuangzw at 2015-09-25
                // 将用户的点击记录加载到历史中
                if ($("#metroNavDirTitle").text() != "工作台") {
                    $.post(
                        './jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_saveHistory', {
                            navId: navId,
                            name: name ? name : $(this).text(),
                            url: url,
                            target: target
                        },
                        function(responseObject) {

                        }
                    );
                }
            }
        });
    };
    // 关闭二级导航面板
    $('.metro-nav-dir-container').children('.close').click(function(e) {
        $('.metro-nav-dir-container').hide(); // 隐藏二级导航面板
        $('.metro-nav-area-panel.current').removeClass('current'); // 取消子系统菜单选中效果
    });
    var timeout_search;
    // 查询所有应用
    $('#navSearch').bind('textchange', function(e) {
        var searchValue = $('#navSearch').val();
        clearTimeout(timeout_search);
        timeout_search = setTimeout(function() {
            if (searchValue == '') {
                var navSysId = $('.metro-nav-area-panel.current').attr('navsysid');
                loadNavDirFunc(navSysId); // 获取二级导航菜单
            } else {
                isContinue = false;
                searchNav(searchValue);
            }
            clearTimeout(timeout_search);
        }, 500);
    });

    // 查询全部应用
    var searchNav = function(searchValue) {
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_search_nav', {
            'searchValue': searchValue
        }, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                var curSysNavFunc = new Array();
                var metroNavDirFuncContainer = $('.metro-nav-dir-func-container');
                metroNavDirFuncContainer.empty();
                var searchNavArray = responseObject['data']['searchNavArray'];
                var len = searchNavArray.length;
                for (var i = 0; i < len; i++) {
                    // 文件夹菜单
                    navDir = searchNavArray[i];
                    var metroNavDir = $('<div class="metro-nav-dir"></div>');
                    var metroNavDirTitle = $('<span class="name"><span class="name" shortName="' + navDir['name'] + '">' + navDir['fullname'] + '</span>');
                    if (navDir['url'] != '' && navDir['url'] != '/' && navDir['url'] != '/test' && navDir['url'] != 'test') {
                        metroNavDirTitle.addClass('metro-nav-goto');
                        metroNavDirTitle.attr('navId', navDir['id']);
                        metroNavDirTitle.attr('url', navDir['url']);
                        metroNavDirTitle.attr('target', navDir['target']);
                    }
                    curSysNavFunc.push(navDir);
                    metroNavDirFuncContainer.append(metroNavDir);
                    metroNavDir.append(metroNavDirTitle);
                }
                navArea['AllSysNav'] = curSysNavFunc;
                renderNavDirFuncEvent();
                isContinue = true;
            } else {
                $.simpleAlert(responseObject['msg'], responseObject['result']);
                isContinue = true;
            }
        }, 'json');
    };
    // 是否允许继续操作，用户防止多次点击保存
    var isContinue = true;
    // 开始
    $('.metro-start').click(function(e) {
        var _curPage = navArea['curPage'] - 0;
        _curPage = isNaN(_curPage) ? 1 : _curPage;
        if (_curPage == 1) return;
        turnPage(1 - _curPage);
    });
    // 点击用户姓名和图像时显示编辑用户信息的面板
    $('.user-info-name,.user-portrait').click(function(e) {
        // 编辑用户信息
        var _edit_user_info_panel = $('#editUserInfoPanel');
        if ($(_edit_user_info_panel).css('display') == 'none') {
            $(_edit_user_info_panel).fadeIn('normal', null, function() {
                $('#editUserInfoPanel').addClass('show');
                $(document).off("click.close").on("click.close", function(e) {
                    if ($('#editUserInfoPanel').hasClass('show')) {
                        $('#editUserInfoPanel').hide().removeClass('show');
                    }
                });
            });
        } else {
            $(_edit_user_info_panel).hide().removeClass('show');
        }
    });
    // 修改登录口令
    $('#updatePasswordBtn').click(function(e) {
        $('#editUserInfoPanel').hide().removeClass('show');
        //$('#updatePasswordForm').find('tr.force-change-pwd-tips').remove();
        //Loginpassword.openupdatePasswordDailog("updatePasswordDailog",isContinue);
        //当手动打开修改口令的时候，需要显示关闭按钮和取消按钮
        Loginpassword.openupdatePasswordDailog("updatePasswordDailog", isContinue, false);
    });
    // 修改用户信息
    $('#updateUserInfoBtn').click(function(e) {
        $('#editUserInfoPanel').hide().removeClass('show');
        $("#updateUserInfoDailog").dialog({
            title: "完善我的联系信息",
            draggable: false,
            buttons: [{
                text: 确定,
                cls: "blue",
                handler: function() {
                    debugger;
                    if (!isContinue) return;
                    isContinue = false; // 禁止下次操作
                    var officeTel = $('#updateUserInfoForm').find('#officeTel').val(); // 办公电话
                    var email = $('#updateUserInfoForm').find('#email').val(); // 外网邮件
                    var mobile = $('#updateUserInfoForm').find('#mobile').val(); // 手机号码
                    var officeFax = $('#updateUserInfoForm').find('#officeFax').val(); // 办公传真
                    if (requiredOfficeTel && $.trim(officeTel) == '') {
                        $.simpleAlert('[办公电话]不允许为空', 'info');
                        isContinue = true;
                        return false;
                    }
                    if (requiredEmail && $.trim(email) == '') {
                        $.simpleAlert('[外网邮箱]不允许为空', 'info');
                        isContinue = true;
                        return false;
                    }
                    if (requiredMobile && $.trim(mobile) == '') {
                        $.simpleAlert('[手机号码]不允许为空', 'info');
                        isContinue = true;
                        return false;
                    }

                    if ($.trim(officeTel) != '' && validate_telephone(officeTel)) { // 验证办公电话
                        $.simpleAlert(办公电话格式不正确, 'info');
                        isContinue = true;
                        return false;
                    }
                    if ($.trim(email) != "" && validate_email(email)) { // 验证外网邮件
                        $.simpleAlert(外网邮件格式不正确, 'info');
                        isContinue = true;
                        return false;
                    }
                    if ($.trim(email) != "" && $.trim(email).length > 40) { // 验证外网邮件
                        $.simpleAlert(外网邮件不允许超过40位字符, 'info');
                        isContinue = true;
                        return false;
                    }
                    if ($.trim(mobile) != '' && validate_mobile(mobile)) { // 验证手机号码
                        $.simpleAlert(手机号码格式不正确, 'info');
                        isContinue = true;
                        return false;
                    }
                    if ($.trim(officeFax) != '' && validate_fax(officeFax)) { // 验证办公传真
                        $.simpleAlert(办公传真格式不正确, 'info');
                        isContinue = true;
                        return false;
                    }

                    //var uidd = 

                    var params_ = {
                        "mobile": mobile,
                        "userId": uid
                    };
                    var param_ = JSON.stringify(params_);

                    var params = $('#updateUserInfoForm').serialize();
                    $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_update_userinfo',
                        params,
                        function(responseObject) {
                            if (responseObject['result'] == 'ok') {
                                $.simpleAlert(个人信息修改成功, responseObject['result'], 2000, {
                                    callback: function() {
                                        $("#updateUserInfoDailog").dialog('close');
                                        isContinue = true;
                                    }
                                });
                            } else {
                                $.simpleAlert(responseObject['msg'], responseObject['result']);
                                isContinue = true;
                            }
                        }, 'json');
                }
            }, {
                text: 关闭,
                handler: function() {
                    $("#updateUserInfoDailog").dialog('close');
                }
            }]
        });
        // 加载数据
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_load_userinfo', {},
            function(responseObject) {
                var data = responseObject['data']['userInfo']['data'];
                if (data == null) return;
                $('#updateUserInfoForm').find('input[type="text"]').each(function(i) {
                    var value = data[$(this).attr('name')];
                    $(this).val(value == undefined ? '' : value);
                });
            }, 'json');
    });
    // ------------------ 图像上传处理 Start -------------------------------
    // 上传用户头像
    $('#uploadUserPortraitBtn,.edit-user-info-portrait,#promptUploadPortrait').click(function(e) {
        $('.awsui-popbox-arrow,.awsui-popbox-arrow-inner').hide();
        $('#editUserInfoPanel').hide().removeClass('show');
        $('#uploadUserPortraitDailog').dialog({
            title: 上传个人头像,
            draggable: false
        });
    });
    if (userPhotoTmp == '') {
        $('#userPhoto,#userPhotoPreview').attr('src', "../apps/com.actionsoft.apps.skins.metro/img/defalut-portrait.png");
        // 禁用裁切按钮
        $('#crop').attr('disabled', 'disabled').addClass('gray');
        $("#crop").unbind('click');
    } else {
        $('#userPhoto').attr('src', userPhotoTmp);
        $('#userPhotoPreview').attr('src', userPhotoTmp);
        // 点击剪裁图片，会对图片进行剪裁并保存
        $("#crop").unbind('click').click(function() {
            cutImage();
        });
    }
    // 初始化剪裁控件
    // Create variables (in this scope) to hold the API and image size
    var jcrop_api, boundx, boundy,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),
        xsize = $pcnt.width(),
        ysize = $pcnt.height();

    $('#userPhoto').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        aspectRatio: 1,
        boxWidth: 550,
        boxHeight: 350
    }, function() {
        // Use the API to get the real image size
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        // Store the API in the jcrop_api variable
        jcrop_api = this;

        // Move the preview into the jcrop container for css positioning
        $preview.appendTo(jcrop_api.ui.holder);
        $('#jcrop-botton').appendTo(jcrop_api.ui.holder);
    });

    function updatePreview(c) {
        if (parseInt(c.w) > 0) {
            var rx = xsize / c.w;
            var ry = ysize / c.h;

            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
            $pimg.attr('x', Math.round(rx * c.x)).attr('y', Math.round(ry * c.y)).attr('ratio', rx);
        }
    };
    // 上传为临时文件
    $('#uploadImage').upfile({
        sid: sid,
        appId: sysAppId,
        groupValue: uid,
        fileValue: uniqueId,
        repositoryName: "!photo-",
        done: function(e, data) {
            if (data['result']['data']['result'] == 'ok') {
                var url = data['result']['data']['data']['attrs']['url'] + '&t=' + new Date().getTime();

                jcrop_api.setImage(url);
                $('#userPhotoPreview').attr('src', url);

                // Use the API to get the real image size
                var w = data['result']['data']['data']['attrs']['width'];
                var h = data['result']['data']['data']['attrs']['height'];
                boundx = w;
                boundy = h;
                $pimg.css({
                    width: w + 'px',
                    height: h + 'px',
                    marginLeft: '0',
                    marginTop: '0'
                });
                $pimg.attr('x', 0).attr('y', 0).attr('ratio', 1);

                // 启用裁切按钮
                $('#crop').removeAttr('disabled').removeClass('gray');
                // 点击剪裁图片，会对图片进行剪裁并保存
                $("#crop").unbind('click').click(function() {
                    cutImage();
                });
            } else {
                $.simpleAlert(data['result']['data']['msg'], data['result']['data']['result']);
            }
        }
    });
    // 裁切头像
    function cutImage() {
        var widgetSize = jcrop_api.tellScaled();
        var x = $pimg.attr('x') == undefined ? 0 : $pimg.attr('x');
        var y = $pimg.attr('y') == undefined ? 0 : $pimg.attr('y');
        var ratio = $pimg.attr('ratio') == undefined ? 1 : $pimg.attr('ratio');
        var url = './jd?sid=' + sid + '&cmd=CLIENT_ORG_USER_PHOTO_CUT';
        awsui.ajax.post(url, {
                uid: uid,
                x: x,
                y: y,
                w: 120,
                h: 120,
                ratio: ratio
            },
            function(responseObject) {
                var url = responseObject['data']['url'] + '&t=' + new Date().getTime();
                $.simpleAlert("头像保存成功", 'ok');
                $('#userPortrait>img').attr('src', url);
                $(".edit-user-info-portrait").attr("src", url);
            }, 'json');

        // 隐藏求真像
        if (isPromptUploadPortrait) {
            isPromptUploadPortrait = false;
            $('.awsui-popbox-arrow,.awsui-popbox-arrow-inner').hide();
            $('#promptUploadPortrait').parent().hide();
        }
    }
    // 关闭窗口
    $("#closeUserPortrait").click(function() {
        $('#uploadUserPortraitDailog').dialog('close');
    });
    // ------------------ 图像上传处理 End -------------------------------

    // 查看登录日志
    $('#viewUserLoginLog').click(function(e) {
        $('#editUserInfoPanel').hide().removeClass('show');
        $("#userLoginLogDailog").dialog({
            title: 查看登录日志,
            buttons: [{
                text: 关闭,
                handler: function() {
                    $("#userLoginLogDailog").dialog('close');
                }
            }]
        });
        // 加载数据
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_get_user_login_log', {
                logCount: userLoginLogCount
            },
            function(responseObject) {
                if (responseObject['result'] == 'ok') {
                    var datas = responseObject['data']['userLoginLog'];
                    // 将数据填充到table中，tableId=userLoginLogTbl
                    var _table = $("#userLoginLogTbl");
                    _table.css('padding', '0');
                    _table.children().remove();
                    var len = datas.length;
                    len = 15;
                    for (var i = 0; i < len; i++) {
                        var data = datas[i];
                        var loginDate = new Date(data['startTime'] - 0).toString('yyyy-MM-dd HH:mm:ss');
                        var logoutDate = data['closed'] ? new Date(data['closeTime'] - 0).toString('yyyy-MM-dd HH:mm:ss') : '';
                        var ip = data['ip'] == undefined ? '' : data['ip'];
                        var _tr = $('<tr><td style="width: 50px; text-align: center; ">' + (i + 1) + '</td>' +
                            '<td style="width: 140px; text-algin: center; ">' + loginDate + '</td>' +
                            '<td style="width: 140px; text-algin: center; ">' + logoutDate + '</td>' +
                            '<td style="width: 100px; text-algin: center; ">' + ip + '</td></tr>');
                        _table.append(_tr);
                    }
                }
            }, 'json');
    });
    // 注销
    $('#logout').click(function(e) {
        $('#editUserInfoPanel').hide().removeClass('show');
        $.confirm({
            'title': 提示,
            content: 确认离开系统吗 + '?',
            onConfirm: function() {
                window.location.href = "./w?sid=" + sid + '&cmd=com.actionsoft.apps.skins.metro_logout';
                window.history = -1;
            }
        });
    });
    // 添加
    $('#metro_operate_add').click(function(e) {
        if (navArea['AllSysNav'] == undefined) {
            // 加载用户所有有权限的功能菜单
            $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_get_all_sys_nav', {},
                function(responseObject) {
                    if (responseObject['result'] == 'ok') {
                        navArea['AllSysNav'] = responseObject['data']['allSysNav'];
                        showAddMetroNavDialog();
                    }
                }, 'json');
        } else {
            showAddMetroNavDialog();
        }
    });
    // 根据functionId获取功能菜单Data
    var getSysNavData = function(_funcId) {
        var len = navArea['AllSysNav'].length;
        for (var i = 0; i < len; i++) {
            var sysNav = navArea['AllSysNav'][i];
            if (sysNav['id'] == _funcId) {
                return sysNav;
            }
        }
    };

    if (changeBackGround == '') {
        $('#changeBackGround').remove();
    } else {
        $('#changeBackGround').text(changeBackGround);
        // 更换背景图片
        $('#changeBackGround').click(function(e) {
            $("#changeBackGroundDialog").dialog({
                title: '换换背景，你最出“色”',
                buttons: [{
                    text: 确定,
                    cls: 'blue',
                    handler: function() {
                        metroBackGround = $('.metro-bg-img.current').attr('imgname');
                        if (metroBackGround == '') {
                            $.simpleAlert('请选择需要设置的背景图片', 'info');
                            return false;
                        }
                        // 保存数据
                        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_set_background', {
                                "metroBackGround": metroBackGround
                            },
                            function(responseObject) {
                                if (responseObject['result'] == 'ok') {
                                    $.simpleAlert("背景设置成功", 'ok');
                                    $("#changeBackGroundDialog").dialog('close');
                                } else {
                                    $.simpleAlert(responseObject['msg'], responseObject['result']);
                                }
                            }, 'json');
                    }
                }, {
                    text: "取消",
                    handler: function() {
                        $('#metro-bg-img').attr('src', bgImgPath + metroBackGround + '_big.jpg');
                        $("#changeBackGroundDialog").dialog('close');
                    }
                }],
                onClose: function() {
                    $('#metro-bg-img').attr('src', bgImgPath + metroBackGround + '_big.jpg');
                    return true;
                }
            });
        });
        $('.metro-bg-img').click(function(e) {
            var imgname = $(this).attr('imgname');
            $('#metro-bg-img').attr('src', bgImgPath + imgname + '_big.jpg');
            $('.metro-bg-img').removeClass('current');
            $(this).addClass('current');
        });
    }
    // 解锁
    $('.metro-nav-lock').click(function(e) {
        $('.metro-nav-dir-container').hide(); // 关闭二级导航面板
        $('.metro-mainframe-panel').hide(); // 关闭功能页面

        $(this).attr('src', '../apps/com.actionsoft.apps.skins.metro/img/unlock.png');
        $('#metroBottomBar').fadeIn();
        navArea['edit'] = true;
        reRenderNav();
    });
    // 取消
    $('#metro_operate_cancel').click(function(e) {
        getLock();
        loadPortletNotifier(); // 定时加载磁贴消息
    });

    function getLock() {
        if ($('#metroBottomBar').css('display') == 'none') return;
        $('#metroBottomBar').hide();
        $('.metro-nav-lock').attr('src', '../apps/com.actionsoft.apps.skins.metro/img/lock.png');
        navArea['edit'] = false;
        reRenderNav();
    }

    // 通知提醒
    var timeout_loadMsgAmount;
    var maxShowAmount = 5; // 最大显示记录数
    var unReadMsgAmount = 0; // 未读记录数
    var unReadMsgList = new Array(); // 未读通知消息集合
    // 定时加载未读通知消息记录数
    function loadUnReadMsgAmount() {
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.notification_load_unread_msg', {}, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                $('#notificationMessageOperate').attr('title', '隐藏');
                var container = $('#notificationMessageListContainer');
                unReadMsgList = responseObject['data']['list'];

                var amount = responseObject['data']['amount'];
                // 如果新加载的记录数为0，则清空未读通知列表
                if (amount == 0) {
                    container.children().stop().slideUp('slow', function(e) {
                        $(this).remove();
                    });
                }
                // 加载之前无通知消息，新加载后有新的通知消息，则渲染通知消息
                else if (unReadMsgAmount == 0) {
                    reRenderUnReadMsgList(container); // 重新渲染未读通知列表
                    unReadMsgAmount = amount;
                    showNotificationMessage(); // 展开显示通知消息
                    notificationArrivalSoundTips(); // 消息到达声音提示
                }
                // 否则，渲染最新的N条未读通知消息
                else {
                    var len = getShowAmount(); // 获取可以显示的未读通知数
                    // 1. 排除不是最新的未读通知：如果页面上未读通知列表中的记录未在最新加载的N跳记录中，则移除；
                    for (var i = 0; i < len; i++) {
                        var data = unReadMsgList[i];
                        var item = container.children('div[msgId="' + data['id'] + '"]');
                        if (item != undefined) item.attr('isNew', true);
                    }
                    container.children('div[isNew!=true]').stop().slideUp('slow', function(e) {
                        $(this).remove();
                    });
                    container.children('div[isNew=true]').removeAttr('isNew'); // 移除标识
                    // 2. 渲染未在未读通知列表中的最新未读通知消息；
                    var hasNewMsg = false; // 是否有新到达的未读通知消息
                    var prevItem = null;
                    for (var i = 0; i < len; i++) {
                        var data = unReadMsgList[i];
                        var item = container.children('div[msgId="' + data['id'] + '"]');
                        // 新的未读通知消息
                        if (item.attr('msgId') == undefined && prevItem == null) {
                            renderUnReadMsgItem(data, container, false);
                            item = container.children('div[msgId="' + data['id'] + '"]');
                            // 最新的一条未读通知记录不在未读通知列表中，说明有新的未读通知到达
                            hasNewMsg = true;
                        } else if (item.attr('msgId') == undefined && prevItem != null) {
                            renderUnReadMsgItem(data, prevItem, true);
                            item = container.children('div[msgId="' + data['id'] + '"]');
                        }
                        prevItem = item;
                    }
                    // 有新未读通知消息到达时，展开显示未读通知列表
                    if (hasNewMsg) {
                        showNotificationMessage(); // 展开显示通知消息
                    }
                    // 3. 移除集合中已渲染的未读通知消息
                    for (var i = 0; i < len; i++) {
                        unReadMsgList.remove(0);
                    }
                }
                settingUnReadMsgAmount(amount); // 设置未读通知记录数
            } else {
                // 加载数据出错，清空通知列表，并隐藏右下角的铃铛
                $('#metroNotificationCenterTips').text('');
                $('#metroNotificationCenterTips').hide();
                $('#notificationMessageOperate,#notificationMessageListContainer').hide();
                $('#notificationMessageListContainer').empty();
            }
            timeout_loadMsgAmount = window.setTimeout(loadUnReadMsgAmount, notificationMsgLoadFrequency * 1000); // 隔1分钟加载一次
        }, 'json');
    }
    // 获取可以显示的未读通知数
    function getShowAmount() {
        var len = unReadMsgList.length;
        return len > maxShowAmount ? maxShowAmount : len;
    }
    // 设置未读通知记录数
    function settingUnReadMsgAmount(amount) {
        if (amount != undefined)
            unReadMsgAmount = amount;
        if (unReadMsgAmount == 0) {
            $('#metroNotificationCenterTips').text('');
            $('#metroNotificationCenterTips').hide();
            $('#notificationMessageOperate').hide();
        } else {
            $('#metroNotificationCenterTips').text(unReadMsgAmount);
            $('#metroNotificationCenterTips').show();
            $('#notificationMessageOperate').show();
        }
    }
    // 重新渲染未读通知列表
    function reRenderUnReadMsgList(container) {
        container.empty();
        var len = getShowAmount(); // 获取可以显示的未读通知数
        for (var i = 0; i < len; i++) {
            var data = unReadMsgList[i];
            renderUnReadMsgItem(data, container);
        }
        for (var i = 0; i < len; i++) {
            unReadMsgList.remove(0);
        }
    }
    // 渲染未读通知消息，isAfter: (undefined: append, true: after, false: prepend)
    function renderUnReadMsgItem(data, container, isAfter) {
        var item = $('<div class="notification-message-item-container"></div>');
        item.addClass(data['notifyLevel']).attr('msgId', data['id']).attr('registerId', data['registerId']);
        var system_icon = $('<span class="notification-appsystem-icon"></span>');
        if (data['icon'] == undefined || data['icon'] == '') {
            system_icon = $('<img class="notification-appsystem-icon" />');
            if (data['notifyLevel'] == 'w') {
                system_icon.attr('src', '../apps/com.actionsoft.apps.notification/img/icon64-warning.png');
            } else if (data['notifyLevel'] == 'e') {
                system_icon.attr('src', '../apps/com.actionsoft.apps.notification/img/icon64-error.png');
            } else {
                system_icon.attr('src', '../apps/com.actionsoft.apps.notification/img/icon64.png');
            }
        } else {
            system_icon = $('<img class="notification-appsystem-icon" />');
            system_icon.attr('src', data['icon']);
        }
        var sender_photo = $('<span class="notification-sender-photo"></span>');
        if (data['photo'] != undefined && data['photo'] != '') {
            sender_photo = $('<img class="notification-sender-photo" />');
            sender_photo.attr('src', data['photo']);
        }
        var content_container = $('<div class="notification-message-content-container"></div>');
        var system_name = $('<div class="notification-appsystem-name">' + data['systemName'] + '</div>');
        var content_width = $(window).width() - 420;
        var maxFonts = content_width / 13 * 2 - 3;
        var content = $('<div class="notification-message-content">' + data['content'] + '</div>');
        //		if (data['content'].length > maxFonts) {
        //			alert(data['content'].substring(0, maxFonts));
        //		    content.html(data['content'].substring(0, maxFonts) + '...');
        //		}
        var buttons = $('<div class="notification-operate-buttons"></div>');
        var datetime = $('<span class="notification-datetime">' + data['createTime'] + '</span>');
        var operate_close = $('<span class="notification-operate-close" title="关闭"></span>');
        operate_close.click(function(e) {
            readNotificationMessage($(this).parent());
            $(document).quicktip('close'); // 关闭quicktip提示
        });
        // 点击内容，打开通知中心
        content.click(function(e) {
            var messageId = $(this).parent().parent().attr('msgId');
            showFunctionWindow("notificationCenter" + messageId, "通知中心", "./w?sid=" + sid + "&cmd=com.actionsoft.apps.notification_center" + "&messageId=" + messageId);
            if ($('#notificationMessageOperate').next().css('display') != 'none') {
                $('#notificationMessageOperate').click();
            }
            clearTimeout(timeout_loadMsgAmount);
            loadUnReadMsgAmount(); // 加载未读
        });

        var operateButtons = data['buttons'];
        if (operateButtons == undefined) {
            var _button = $('<span class="button notification-operate-button">忽略</span>');
            buttons.append(_button);
            _button.click(function(e) { //  忽略，设置为已读
                readNotificationMessage($(this).parent().parent());
            });
        } else {
            var len_ii = operateButtons.length;
            // 最多值允许3个按钮
            len_ii = (len_ii > 3) ? 3 : len_ii;
            for (var ii = 0; ii < len_ii; ii++) {
                var _button = operateButtons[ii];
                var action = _button['action'] == undefined ? '' : _button['action'];
                var functionId = _button['functionId'] == undefined ? '' : _button['functionId'];
                var functionName = _button['functionName'] == undefined ? '' : _button['functionName'];
                // 如果只给定名称，没有action动作参数，在该button区域显示一个简单提示信息。例如用户批准了加入小组的申请，在通知中心再次查看该信息时逻辑判断该用户已加入，则不提供批准的button，显示“ABC已被批准加入XYZ小组”
                if (action == '') {
                    var _btn = $('<span class="notification-operate-info">' + _button['name'] + '</span>');
                    buttons.append(_btn);
                    continue;
                }
                var _btn = $('<span class="button notification-operate-button">' + _button['name'] + '</span>');
                var color = _button['color'] == undefined ? '' : _button['color'];
                _btn.addClass(color);
                _btn.attr('target', _button['target']).attr('action', action).attr('functionId', functionId).attr('functionName', functionName);
                _btn.click(function(e) {
                    var target = $(this).attr('target');
                    if (target == 'blank' || target == '_blank') {
                        window.open($(this).attr('action'));
                    } else if (target == 'mainFrame') {
                        window.showFunctionWindow($(this).attr('functionId'), $(this).attr('functionName'), $(this).attr('action'), true);
                    } else if (target == 'ajax') {
                        awsui.ajax.post($(this).attr('action'), {}, function(e) {}, 'json');
                    }
                    readNotificationMessage($(this).parent().parent()); // 设置为已读
                });
                buttons.append(_btn);
            }
        }
        if (isAfter == undefined) {
            container.append(item);
        } else if (isAfter) {
            container.after(item);
        } else {
            container.prepend(item);
        }
        item.append(system_icon).append(sender_photo).append(content_container).append(buttons).append(datetime).append(operate_close);
        content_container.append(system_name).append(content);
        item.stop().slideDown('slow');
    }
    // 阅读通知消息
    function readNotificationMessage(itemObj) {
        var msgId = $(itemObj).attr('msgId');
        var registerId = $(itemObj).attr('registerId');
        awsui.ajax.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.notification_read_message', {
            'id': msgId,
            'registerId': registerId
        }, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                $(itemObj).stop().slideUp('slow', function(e) {
                    $(itemObj).remove();
                    unReadMsgAmount--;
                    settingUnReadMsgAmount();
                    if (unReadMsgList.length > 0) {
                        var container = $('#notificationMessageListContainer');
                        renderUnReadMsgItem(unReadMsgList[0], container);
                        unReadMsgList.remove(0);
                    }
                });
            } else {
                $.simpleAlert(responseObject['msg'], responseObject['result']);
            }
        }, 'json');
    }
    // 显示消息通知
    function showNotificationMessage() {
        var _self = $('#notificationMessageOperate');
        // 展开
        _self.removeClass('top');
        _self.next().stop().slideDown('slow', function(e) {
            _self.attr('title', '隐藏');
            _self.children('img').attr('src', '../apps/com.actionsoft.apps.skins.metro/img/logo-notification.png');
        });
    }
    // 消息到达声音提示
    function notificationArrivalSoundTips() {
        if (notificationSoundTips) {

        }
    }
    // 已读消息（供外部调用）
    top.window.readNotificationMsg = function(msgId) {
            var container = $('#notificationMessageListContainer');
            var item = container.children('div[msgId="' + msgId + '"]');
            if (item.hasClass('notification-message-item-container')) { // 已展示出
                item.remove();
                unReadMsgAmount--;
                settingUnReadMsgAmount();
                if (unReadMsgList.length > 0) {
                    renderUnReadMsgItem(unReadMsgList[0], container);
                    unReadMsgList.remove(0);
                }
            } else { // 未展示
                var len = unReadMsgList == undefined ? 0 : unReadMsgList.length;
                for (var i = 0; i < len; i++) {
                    var message = unReadMsgList[i];
                    if (message['id'] == msgId) {
                        unReadMsgList.remove(i);
                        unReadMsgAmount--;
                        settingUnReadMsgAmount();
                        break;
                    }
                }
            }
        }
        // 初始化通知中心
    function initNotification() {
        if (isStartNotification) {
            // 通知中心
            $('#metroNotificationCenter,#metroNotificationCenterTips').click(function(e) {
                clearTimeout(timeout_loadMsgAmount);
                loadUnReadMsgAmount(); // 加载未读
                showFunctionWindow("notificationCenter", "通知中心", "./w?sid=" + sid + "&cmd=com.actionsoft.apps.notification_center");
                if ($('#notificationMessageOperate').next().css('display') != 'none') {
                    $('#notificationMessageOperate').click();
                }
            });
            // 展开/隐藏消息通知面板
            $('#notificationMessageOperate').click(function(e) {
                var _self = $(this);
                if (_self.next().css('display') == 'none') {
                    showNotificationMessage(); // 展开显示通知消息
                } else {
                    // 收缩
                    _self.next().stop().slideUp('slow', function(e) {
                        _self.addClass('top').attr('title', '显示');
                        _self.children('img').attr('src', '../apps/com.actionsoft.apps.skins.metro/img/logo-notification-untitled.png');
                    });
                }
            });
            loadUnReadMsgAmount(); // 定时加载未读通知消息记录数
        } else {
            // 隐藏消息通知图标(左侧的图标和消息数，右下角的铃铛)
            $('#metroNotificationCenter,#metroNotificationCenterTips,#notificationMessageContainer').hide();
        }
    }
    // 完成，保存数据
    $('#metro_operate_complate').click(function(e) {
        saveMetroNav();
    });
    // 保存数据
    var saveMetroNav = function(e) {
        var funcIds = $('.nav-panel').find('.nav-area-panel').map(function() {
            var funcId = $(this).attr('func_id');
            if (funcId == '' || funcId == undefined) funcId = $(this).attr('id');
            if ($(this).hasClass('freeze')) funcId = '';
            return funcId;
        }).get().join(',');
        // 保存数据
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_save_metro_nav', {
                "funcIds": funcIds
            },
            function(responseObject) {
                if (responseObject['result'] == 'ok') {
                    $('#metroBottomBar').hide();
                    $('.metro-nav-lock').attr('src', '../apps/com.actionsoft.apps.skins.metro/img/lock.png');
                    navArea['MetroNavDatas'] = responseObject['data']['metroNavs'];
                    navArea['edit'] = false;
                    reRenderNav();
                    loadPortletNotifier(); // 定时加载磁贴消息
                } else {
                    $.simpleAlert(responseObject['msg'], responseObject['result']);
                }
            }, 'json');
    };

    var timeout_MoveNav; // 移动功能块
    var timeout_PortletNotifier; // 加载磁贴消息
    var isOutCollection = false;
    var navArea = {};
    navArea['edit'] = false; // 编辑状态，默认为false
    navArea['navAreaRowNumel'] = 2; // 功能区域行数，默认为2行
    navArea['navAreaColNumel'] = 5; // 功能区域列数，默认为5列
    navArea.dragItem = {}; // 移动的对象
    navArea['MetroNavDatas'] = [];
    var navAreaArray = new Array();
    // 创建功能菜单面板
    var createNavArea = function(data, nav_collection, type) {
        var img_url = data['icon96'] == '' ? '../apps/com.actionsoft.apps.skins.metro/img/i-workbench.png' : data['icon96'];
        var nav_area_panel = $('<div class="nav-area-panel" id="' + data['id'] + '" func_id="' + (data['functionId'] == undefined ? "" : data['functionId']) + '" appId = "' + data['appId'] + '" orderIdx="' + data['orderIdx'] + '" ' +
            ' rowNumel="' + data['rowNumel'] + '" colNumel="' + data['colNumel'] + '" ></div>');
        var nav_area_img = $('<div class="nav-area-img-panel"><img class="nav-area-img" src="' + img_url + '"/><div class="nav-area-img-mask"></div></div>');
        var nav_area_title = $('<div class="nav-area-title">' + data['name'] + '</div>');
        if (data['createUser'] == '') {
            nav_area_panel.addClass('freeze');
        }
        if (type == 2) { // （1-2）
            nav_area_panel.addClass('two');
            nav_area_title.addClass('two');
            var nav_area_img_panel = $('<div class="nav-area-img-panel two"></div>');
            nav_area_img = $('<img class="nav-area-img two" src="' + img_url + '"/>');
            var nav_area_content_panel = $('<div class="nav-area-content-panel two"></div>');

            var nav_area_content = $('<div class="nav-area-content two">' + (data['content'] == undefined ? data['name'] + 信息 : data['content']) + '</div>');
            // 如果是磁贴消息
            if (data['notifier'] != undefined && data['notifier'] != '' && !navArea['edit']) {
                nav_area_content.html('<img style="width: 40px; height: 40px; margin-top: 20px; margin-left: 80px; " src="../apps/com.actionsoft.apps.skins.metro/img/loading.gif" />');
            }
            nav_collection.append(nav_area_panel);
            nav_area_panel.append(nav_area_img_panel).append(nav_area_content_panel);
            nav_area_img_panel.append(nav_area_img);
            nav_area_content_panel.append(nav_area_title).append(nav_area_content);
        } else if (type == 4) { // （2-2）
            nav_area_panel.addClass('four');
            nav_area_title.addClass('four');
            var nav_area_img_panel = $('<div class="nav-area-img-panel four"></div>');
            nav_area_img = $('<img class="nav-area-img four" src="' + img_url + '"/>');
            var nav_area_content = $('<div class="nav-area-content four">' + (data['content'] == undefined ? data['name'] + 信息 : data['content']) + '</div>');
            // 如果是磁贴消息
            if (data['notifier'] != undefined && data['notifier'] != '' && !navArea['edit']) {
                nav_area_content.html('<img style="width: 140px; height: 140px; margin-left: 35px; " src="../apps/com.actionsoft.apps.skins.metro/img/loading.gif" />');
            }
            nav_collection.append(nav_area_panel);
            nav_area_panel.append(nav_area_title).append(nav_area_img_panel).append(nav_area_content);
            nav_area_img_panel.append(nav_area_img);
        } else { // （1-1）
            nav_area_panel.append(nav_area_img).append(nav_area_title);
            nav_collection.append(nav_area_panel);
        }
        nav_collection.attr('unitNumel', nav_collection.attr('unitNumel') - 0 + data['rowNumel'] * data['colNumel']);

        if (!navArea['edit']) { // 非编辑状态
            // 磁帖消息
            if (data['tile'] != undefined) {
                var tile = isNaN(data['tile'] - 0) ? (data['tile'] - 0) : data['tile'];
                if (isNaN(data['tile']) && tile > 99) {
                    $(nav_area_panel).append('<div class="nav-area-tile" style="right: 3px; ">99<span class="nav-area-tile-add">+</span></div>');
                } else {
                    $(nav_area_panel).append('<div class="nav-area-tile">' + tile + '</div>');
                }
            }
            if (data['content'] != undefined) {
                nav_area_panel.html(data['content']);
            }
            //
            if (data['name'] == "公告") {
                $(nav_area_panel).on('click', 'a', function(e) {
                    var appId = data['appId'];
                    if (checkAppActive(appId)) {
                        if ($(this).attr("class") && $(this).attr("class") != "") {
                            if (data['url'] != undefined && data['url'] != '' && data['target'] != '_blank') {
                                showFunctionWindow(data['functionId'] ? data['functionId'] : data['id'], data['name'], data['url']);
                            } else if (data['url'] != undefined && data['url'] != '' && data['target'] == '_blank') {
                                window.open(data['url']);
                            }
                        }
                    }
                });
            } else if (data['url'] != undefined && data['url'] != '' && data['name'] != "待办任务") {
                $(nav_area_panel).click(function(e) {
                    var appId = data['appId'];
                    if (checkAppActive(appId)) {
                        if (data['url'] != undefined && data['url'] != '' && data['target'] != '_blank') {
                            showFunctionWindow(data['functionId'] ? data['functionId'] : data['id'], data['name'], data['url']);
                        } else if (data['url'] != undefined && data['url'] != '' && data['target'] == '_blank') {
                            window.open(data['url']);
                        }
                    }
                }).css('cursor', 'pointer');
            }
            return;
        }
        if (data['content'] != undefined) {
            $(nav_area_panel).html(data['content']);
        }
        // 判断是否为锁定功能块(非锁定)
        if (!nav_area_panel.hasClass('freeze')) {
            // 编辑状态
            // 增加删除操作
            var nav_area_delete = $('<div class="nav-area-delete"></div>');
            nav_area_panel.append(nav_area_delete);
            nav_area_delete.click(function(e) {
                removeNavArea(nav_area_panel); // 移除块
                e.stopPropagation(); // 阻止事件冒泡
            }).mousedown(function(e) {
                e.stopPropagation(); // 阻止事件冒泡
            });
            nav_area_panel.addClass('edit'); // 设置光标
            bindNavAreaEvent(nav_area_panel);
        }
    };
    // 移除块
    var removeNavArea = function(nav_area_panel, operate) {
        var nav_collection = $(nav_area_panel).parent();
        var startIdx = $(nav_area_panel).attr('orderIdx') - 0; // 从删除的图标开始
        var unit = $(nav_area_panel).hasClass('two') ? 2 : 1;
        nav_area_panel.remove();
        nav_collection.attr('unitNumel', nav_collection.attr('unitNumel') - unit);
        var startPage = navArea['curPage'];
        if (operate) {
            startPage = nav_collection.attr('pageNo');
        }
        for (var i = startPage; i < navArea['pages']; i++) {
            var cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(i - 1);
            var next_nav_collection = $('.nav-panel').find('.nav-collection').eq(i);
            var m = 0,
                n = 0,
                k = 0;
            while (m < unit) {
                if (k / navArea['size'] == 0 && k != 0) { // 如果该page中没有符合删除块的功能菜单块，则跳过该page，继续循环下一个page，避免重复循环，故i++
                    var cur_page = i + Math.floor(k / navArea['size']);
                    if (cur_page > navArea['pages']) i = navArea['pages'];
                    break;
                    next_nav_collection = $('.nav-panel').find('.nav-collection').eq(cur_page);
                    i++;
                    n = 0;
                }
                var nav_area = next_nav_collection.find('.nav-area-panel').eq(n);
                var cur_unit = nav_area.hasClass('two') ? 2 : 1;
                if (cur_unit <= unit) {
                    cur_nav_collection.append(nav_area);
                    cur_nav_collection.attr('unitNumel', cur_nav_collection.attr('unitNumel') - 0 + cur_unit);
                    next_nav_collection.attr('unitNumel', next_nav_collection.attr('unitNumel') - cur_unit);
                    nav_area.addClass('update');
                    m += cur_unit;
                }
                k += cur_unit;
                n++;
            }
        }
        // ## 根据排列位置重新计算序号
        var endIdx = $('.nav-panel').find('.nav-area-panel').length;
        for (var i = startIdx; i < endIdx; i++) {
            var nav_area_t = $('.nav-panel').find('.nav-area-panel').eq(i);
            nav_area_t.attr('orderIdx', i);
        }
        var reduceCollection = false; // 是否减少了collection
        // ## 重新计算nav-collection
        $('.nav-panel').find('.nav-collection').each(function(i) {
            if ($(this).children().length == 0 && navArea['pages'] > 1) {
                $(this).parent().remove();
                navArea['pages'] = navArea['pages'] - 1;
                reduceCollection = true;
            }
        });
        // 如果编辑前显示页为最后一页，而且减少了页面，跳转到编辑后的最后一页，使用turnPage实现动态效果
        if (navArea['curPage'] > navArea['pages']) {
            turnPage(navArea['pages'] - navArea['curPage']);
        }
        if (reduceCollection) {
            createPagingToolbar(); // 重新创建分页栏
            $('.nav-panel').find('.turn-next').last().removeClass('turn-next').addClass('turn-none'); // 去除最后一页的向右翻页的图标
        }
    };
    // 移动块位置
    var moveNavAreaPosition = function(e) {
        navArea.dragItem.offset({
            top: e.pageY - navArea.dragItem.original_offsetTop,
            left: e.pageX - navArea.dragItem.original_offsetLeft
        });
    };
    // 绑定功能菜单区域的事件
    var bindNavAreaEvent = function(nav_area_panel) {
        // 准备拖曳
        var dragStart = function(e, obj) {
            // clone一个，填充到功能菜单容器中，为了可以在分页中进行移动
            navArea.dragItem = nav_area_panel.clone();
            navArea.dragItem.moveable = true; // 移动模式
            // 鼠标和选择块的pageX、pageY的差距
            navArea.dragItem.original_offsetTop = e.pageY - $(obj).offset().top;
            navArea.dragItem.original_offsetLeft = e.pageX - $(obj).offset().left;
            var nav_panel = $('.nav-panel');
            nav_panel.append(navArea.dragItem);
            navArea.dragItem.css('cursor', 'move').css('opacity', 0.9).css('z-index', 999)
                .css('width', $(obj).width() - 2).css('height', $(obj).height() - 2).css('position', 'absolute')
                .offset({
                    'top': $(obj).offset().top + 1,
                    'left': $(obj).offset().left + 1
                });
            // 将当前区域改为虚线框，并移除里面的内容
            nav_area_panel.addClass('temp').css('width', $(obj).width() - 2).css('height', $(obj).height() - 2);
            nav_area_panel.children().remove();
            navArea['originalId'] = nav_area_panel.attr('id'); // 拖曳的源
        };
        // 选中功能菜单块，准备拖曳
        $(nav_area_panel).mousedown(function(e) {
            dragStart(e, this);
            e.stopPropagation(); // 阻止事件冒泡
        });
        // 鼠标移动时，进行拖曳
        $(document).mousemove(function(e) {
            if (!navArea.dragItem.moveable) return false;
            // 判断移动位置
            var cur_nav_area_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
            var nav_area_collection = cur_nav_area_collection; // 面板容器
            // 是否移动到面板容器外
            var drag_width_middle = navArea.dragItem.offset().left + navArea.dragItem.width() / 2; // 移动块的左右的中间线
            var drag_height_middle = navArea.dragItem.offset().top + navArea.dragItem.height() / 2; // 移动块的上下的中间线
            var collection_left = $(nav_area_collection).offset().left;
            var collection_right = $(nav_area_collection).offset().left + $(nav_area_collection).width();
            var collection_top = $(nav_area_collection).offset().top;
            var collection_bottom = $(nav_area_collection).offset().top + $(nav_area_collection).height();
            if (drag_width_middle <= collection_left && navArea['curPage'] != 1) { // 移除容器（往左移）
                if (!isOutCollection) { // 初次移到容器外
                    isOutCollection = true;
                    clearTimeout(timeout_MoveNav);
                    timeout_MoveNav = setTimeout(function() {
                        clearTimeout(timeout_MoveNav); // 停止定时器
                        turnPage(-1); // 翻页
                        var cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
                        var next_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage']);
                        var unit = $(navArea.dragItem).hasClass('two') ? 2 : 1;
                        var m = 0,
                            n = cur_nav_collection.find('.nav-area-panel').length - 1,
                            k = 0,
                            targin_orderIdx = 0;
                        while (m < unit) {
                            if (k / navArea['size'] == 0 && k != 0) {
                                var cur_page = navArea['curPage'] - Math.floor(k / navArea['size']);
                                if (cur_page > navArea['pages']) break;
                                cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(cur_page - 1);
                                n = cur_nav_collection.find('.nav-area-panel').length - 1;
                            }
                            var nav_area = cur_nav_collection.find('.nav-area-panel').eq(n);
                            var cur_unit = nav_area.hasClass('two') ? 2 : 1;
                            if (cur_unit <= unit) {
                                // 移动下一页的第一个位置
                                next_nav_collection.append(nav_area);
                                targin_orderIdx = nav_area.attr('orderIdx') - 0;
                                nav_area.addClass('update');
                                m += cur_unit;
                            }
                            k += cur_unit;
                            n--;
                        }
                        var nav_area_panel_temp = $('.nav-panel').find('.nav-area-panel.temp');
                        var original_orderIdx = nav_area_panel_temp.attr('orderIdx') - 0;
                        cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
                        cur_nav_collection.append(nav_area_panel_temp);
                        // ## 根据排列位置重新计算序号
                        var startIdx = targin_orderIdx < original_orderIdx ? targin_orderIdx : original_orderIdx;
                        var endIdx = original_orderIdx > targin_orderIdx ? original_orderIdx : targin_orderIdx;
                        for (var j = startIdx; j <= endIdx; j++) {
                            var nav_area_t = $('.nav-panel').find('.nav-area-panel').eq(j);
                            nav_area_t.attr('orderIdx', j);
                        }
                    }, 1000);
                }
                moveNavAreaPosition(e); // 移动块位置
                return false;
            } else if (drag_width_middle >= collection_right && navArea['curPage'] != navArea['pages']) { // 移出容器（往右移）
                if (!isOutCollection) { // 初次移到容器外
                    isOutCollection = true;
                    clearTimeout(timeout_MoveNav);
                    timeout_MoveNav = setTimeout(function() {
                        clearTimeout(timeout_MoveNav); // 停止定时器
                        turnPage(1); // 翻页
                        var cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
                        var prev_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 2);
                        var unit = $(navArea.dragItem).hasClass('two') ? 2 : 1;
                        var m = 0,
                            n = 0,
                            k = 0,
                            targin_orderIdx = 0;
                        while (m < unit) {
                            if (k / navArea['size'] == 0 && k != 0) {
                                var cur_page = navArea['curPage'] + Math.floor(k / navArea['size']);
                                if (cur_page > navArea['pages']) break;
                                cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(cur_page - 1);
                                n = 0;
                            }
                            var nav_area = cur_nav_collection.find('.nav-area-panel').eq(n);
                            var cur_unit = nav_area.hasClass('two') ? 2 : 1;
                            if (cur_unit <= unit) {
                                prev_nav_collection.append(nav_area);
                                nav_area.addClass('update');
                                m += cur_unit;
                                targin_orderIdx = nav_area.attr('orderIdx') - 0;
                            }
                            k += cur_unit;
                            n++;
                        }
                        var nav_area_panel_temp = $('.nav-panel').find('.nav-area-panel.temp');
                        var original_orderIdx = nav_area_panel_temp.attr('orderIdx') - 0;
                        cur_nav_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
                        cur_nav_collection.prepend(nav_area_panel_temp);
                        // ## 根据排列位置重新计算序号
                        var startIdx = targin_orderIdx < original_orderIdx ? targin_orderIdx : original_orderIdx;
                        var endIdx = original_orderIdx > targin_orderIdx ? original_orderIdx : targin_orderIdx;
                        for (var j = startIdx; j <= endIdx; j++) {
                            var nav_area_t = $('.nav-panel').find('.nav-area-panel').eq(j);
                            nav_area_t.attr('orderIdx', j);
                        }
                    }, 1000);
                }
                moveNavAreaPosition(e); // 移动块位置
                return false;
            } else if (drag_height_middle <= collection_top || drag_height_middle >= collection_bottom) { // 移除容器（上下）
                isOutCollection = false;
                return false;
            }
            // 在容器之内移动，停止定时器
            clearTimeout(timeout_MoveNav);
            isOutCollection = false;
            moveNavAreaPosition(e); // 移动块位置
            var cur_nav_area_collection = $('.nav-panel').find('.nav-collection').eq(navArea['curPage'] - 1);
            var nav_area_collection = cur_nav_area_collection; // 面板容器
            var nav_area_panel_list = nav_area_collection.children();
            var len = nav_area_panel_list.length;
            for (var i = 0; i < len; i++) {
                var obj = nav_area_panel_list.get(i);
                if ($(obj).hasClass('freeze')) continue;
                var obj_left = $(obj).offset().left;
                var obj_right = $(obj).offset().left + $(obj).width();
                var obj_top = $(obj).offset().top;
                var obj_bottom = $(obj).offset().top + $(obj).height();
                if (drag_width_middle >= obj_left && drag_width_middle <= obj_right &&
                    drag_height_middle >= obj_top && drag_height_middle <= obj_bottom &&
                    $(obj).attr('id') != nav_area_panel.attr('id')) { // 移动到目标位置
                    if (navArea['targetItem'] != undefined && navArea['targetId'] != $(obj).attr('id')) {
                        navArea['targetId'] = $(obj).attr('id'); // 拖曳的目标
                        navArea['targetItem'] = obj;
                        // 根据移动位置将功能菜单块重新排版
                        var nav_area_panel_temp = $('.nav-panel').find('.nav-area-panel.temp');
                        var orderIdx_original = nav_area_panel_temp.attr('orderIdx') - 0;
                        var orderIdx_target = $(obj).attr('orderIdx') - 0;
                        if (orderIdx_original > orderIdx_target) { // 从后往前移，移动到目标位置的前面
                            $(obj).before(nav_area_panel_temp);
                        } else { // 从前往后移，移动到目标位置的后面
                            $(obj).after(nav_area_panel_temp);
                        }
                        // ## 根据排列位置重新计算序号
                        var startIdx = orderIdx_original < orderIdx_target ? orderIdx_original : orderIdx_target;
                        var endIdx = orderIdx_original > orderIdx_target ? orderIdx_original : orderIdx_target;
                        for (var j = startIdx; j <= endIdx; j++) {
                            var nav_area_t = $('.nav-panel').find('.nav-area-panel').eq(j);
                            nav_area_t.attr('orderIdx', j);
                        }
                        break;
                    } else {
                        navArea['targetId'] = $(obj).attr('id'); // 拖曳的目标
                        navArea['targetItem'] = obj;
                    }
                }
            }
        }).mouseup(function(e) { // 取消选择，取消拖曳
            if (navArea.dragItem.moveable) {
                navArea.dragItem.moveable = false; // 取消移动模式
                clearTimeout(timeout_MoveNav); // 停止定时器
                var nav_area = $('.nav-panel').children('.nav-area-panel');
                $('.nav-panel').find('.nav-area-panel.temp').append(nav_area.children()).removeClass('temp').css('width', '').css('height', '');
                nav_area.remove();
            }
        });
    };
    // 创建分页栏面板 TODO 调整面板
    function createPagingToolbar() {
        var width = $(window).width() - $('.metro-nav-panel').width();
        // 添加分页栏
        var pagingToolbar = $('.metro-content-panel').find('.nav-paging-toolbar');
        if (pagingToolbar.length == 0) {
            pagingToolbar = $('<div class="nav-paging-toolbar" style="width: ' + width + 'px"></div>');
            $('.metro-content-panel').append(pagingToolbar);
        } else {
            $(pagingToolbar).children().remove();
            $(pagingToolbar).css('width', width + 'px');
        }
        for (var i = 0; i < navArea['pages']; i++) {
            var nav_toolbar_item = $('<div class="point" awsui-qtip="' + (i + 1) + '" page="' + (i + 1) + '"></div>');
            if (i + 1 == navArea['curPage']) $(nav_toolbar_item).addClass('current');
            pagingToolbar.append(nav_toolbar_item);
            $(nav_toolbar_item).click(function(e) {
                var thisPage = $(this).attr('page');
                var step = thisPage - navArea['curPage'];
                if (step != 0) turnPage(step);
            });
        }
        $(document).quicktip();
    }
    // 设置页码数
    function setPaging() {
        var width = $(window).width() - $('.metro-nav-panel').width();
        $('.nav-paging-toolbar').css('width', width + 'px');
        $('.nav-paging-toolbar').children('.current').removeClass('current');
        var curItem = $('.nav-paging-toolbar').children().eq(navArea['curPage'] - 1);
        $(curItem).addClass('current');
    }
    // 翻页
    function turnPage(step) {
        if (navArea['curPage'] + step > navArea['pages'] || navArea['curPage'] + step <= 0) {
            return;
        }
        var _width = $(window).width() - $('.metro-nav-panel').width();
        navArea['curPage'] = navArea['curPage'] + step;
        $('.nav-panel').animate({
            left: -((navArea['curPage'] - 1) * _width) + 'px'
        }, 'slow');
        setPaging();
    }
    // 渲染功能菜单 TODO 调整
    var renderNav = function(datas) {
        if (datas == undefined) datas = navArea['MetroNavDatas'];
        var win_width = $(window).width() - $('.metro-nav-panel').width();
        var len = datas.length;
        var nav_panel = $('.nav-panel');
        var nav_collection_panel;
        var nav_collection;
        navArea['size'] = navArea['navAreaRowNumel'] * navArea['navAreaColNumel'];
        if (len == 0) {
            navArea['pages'] = 1;
            navArea['curPage'] = 1;
            var nav_collection_panel = $('<div id="collection-0" class="nav-collection-panel" style="width: ' + (win_width - 2) + 'px;"></div>');
            var nav_collection = $('<div class="nav-collection" pageNo="1" unitNumel="0"></div>');
            nav_panel.append(nav_collection_panel);
            nav_collection_panel.append(nav_collection);
            nav_collection.css('width', navArea['navWidth'] + 'px').css('height', navArea['navHeight'] + 'px');
            $('.nav-collection-panel').css('top', ($('.nav-panel').height() - $('.nav-collection-panel').height()) / 2 + 'px');
            return false;
        }
        var unitCounts = 0;
        for (var i = 0; i < len; i++) {
            var rowNumel = navArea['MetroNavDatas'][i]['rowNumel'] - 0;
            var colNumel = datas[i]['colNumel'] - 0;
            unitCounts = unitCounts + (isNaN(rowNumel) ? 1 : rowNumel) * (isNaN(colNumel) ? 1 : colNumel);
        }
        navArea['pages'] = Math.ceil(unitCounts / navArea.size);
        navArea['curPage'] = 1;
        var k = 0; // 已渲染的单元数
        var m = 0; // 已渲染的功能菜单数
        var unRenderArray = new Array(); // 已循环而未渲染的功能菜单
        var cur_unit = 1; // 当前渲染功能菜单的单元数，默认为一个单元
        // 添加新的页面
        var addNewPage = function() {
            if (k % navArea['size'] == 0) { // 添加功能页面
                var _curPage = Math.floor(k / navArea['size']);
                nav_collection_panel = $('<div id="collection-' + _curPage + '" class="nav-collection-panel" style="width: ' + (win_width - 2) + 'px;"></div>');
                nav_collection = $('<div class="nav-collection" pageNo="' + (_curPage + 1) + '" unitNumel="0"></div>');
                nav_panel.append(nav_collection_panel);
                nav_collection_panel.append(nav_collection);
                if (_curPage != 0) { // 上一页
                    var turn_prev = $('<span class="turn-prev"></span>');
                    nav_collection.before(turn_prev);
                    turn_prev.click(function(e) {
                        turnPage(-1);
                    });
                } else nav_collection.before('<div class="turn-none">&nbsp;</div>'); // 补白位置
                if (_curPage != navArea['pages'] - 1 && navArea['pages'] > 1) { // 下一页
                    var turn_next = $('<span class="turn-next"></span>');
                    nav_collection.after(turn_next);
                    turn_next.click(function(e) {
                        turnPage(1);
                    });
                } else nav_collection.after('<div class="turn-none">&nbsp;</div>'); // 补白位置
            }
        };
        // 渲染已循环而未渲染的功能菜单，flag：标识，是否只剩下过大的功能菜单
        var renderUnNav = function(flag) {
            var unRenderArray_temp = new Array(); // 临时容器，存储每行由于区域范围不够而未渲染的功能菜单
            var len_j = unRenderArray.length;
            for (var j = 0; j < len_j; j++) { // 循环由于单元数过大而未渲染的功能菜单
                data = unRenderArray[j];
                // 行个数和列个数
                var rowNumel = 1;
                if (isNaN(data['rowNumel'] - 0)) data['rowNumel'] = 1;
                else rowNumel = data['rowNumel'] - 0;
                var colNumel = 1;
                if (isNaN(data['colNumel'] - 0)) data['colNumel'] = 1;
                else colNumel = data['colNumel'] - 0;
                // 当前渲染功能菜单的单元数，默认为一个单元
                cur_unit = rowNumel * colNumel;
                // 添加功能菜单
                if (data['rowNumel'] == 1 && data['colNumel'] == 2) {
                    var surplus_unit = navArea['size'] - k % navArea['size']; // 剩余的单元数
                    // 如果已加载完成
                    if (flag) {
                        // 如果剩余的单元区域小于当前区域，则新建一个页面
                        if (surplus_unit < cur_unit) {
                            k += surplus_unit;
                            addNewPage(); // 重新判断是否需要新增页面
                        }
                        data['orderIdx'] = m++;
                        createNavArea(data, nav_collection, 2); // 创建功能菜单块
                        navAreaArray.push(data);
                        k = k + cur_unit;
                        addNewPage(); // 重新判断是否需要新增页面
                    } else {
                        // 如果该页剩余的单元数小于当前渲染的功能菜单所需的单元数，则将跳过该功能菜单，加载其他的功能菜单
                        if (surplus_unit < cur_unit || (surplus_unit > navArea['size'] / 2 && surplus_unit - navArea['size'] / 2 < cur_unit)) {
                            unRenderArray_temp.push(data);
                            continue;
                        } else {
                            data['orderIdx'] = m++;
                            createNavArea(data, nav_collection, 2); // 创建功能菜单块
                            navAreaArray.push(data);
                            k = k + cur_unit;
                            addNewPage(); // 重新判断是否需要新增页面
                        }
                    }
                } else {
                    data['orderIdx'] = m++;
                    createNavArea(data, nav_collection); // 创建功能菜单块
                    navAreaArray.push(data);
                    k++;
                    addNewPage(); // 重新判断是否需要新增页面
                }
            }
            unRenderArray = unRenderArray_temp;
        };
        // 循环加载功能菜单
        for (var i = 0; i < len; i++) {
            addNewPage();
            var data;

            renderUnNav(); // 渲染已循环而未渲染的功能菜单

            data = datas[i];
            data['num'] = i + 1;
            // 行个数和列个数
            var rowNumel = 1;
            if (isNaN(data['rowNumel'] - 0)) data['rowNumel'] = 1;
            else rowNumel = data['rowNumel'] - 0;
            var colNumel = 1;
            if (isNaN(data['colNumel'] - 0)) data['colNumel'] = 1;
            else colNumel = data['colNumel'] - 0;
            // 当前渲染功能菜单的单元数，默认为一个单元
            cur_unit = rowNumel * colNumel;
            // 添加功能菜单
            if (rowNumel == 1 && colNumel == 2) { // 1-2
                var surplus_unit = navArea['size'] - k % navArea['size']; // 剩余的单元数
                if (surplus_unit < cur_unit || (surplus_unit > navArea['size'] / 2 && surplus_unit - navArea['size'] / 2 < cur_unit)) { // 如果该页剩余的单元数小于当前渲染的功能菜单所需的单元数，则将跳过该功能菜单，加载其他的功能菜单
                    unRenderArray.push(data);
                    continue;
                } else {
                    data['orderIdx'] = m++;
                    createNavArea(data, nav_collection, 2);
                    navAreaArray.push(data);
                    k = k + cur_unit;
                }
            } else { // 1-1
                data['orderIdx'] = m++;
                createNavArea(data, nav_collection);
                navAreaArray.push(data);
                k = k + cur_unit;
            }
        }
        renderUnNav(true); // 渲染已循环而未渲染的功能菜单

        $(nav_panel).find('.nav-collection').css('width', navArea['navWidth'] + 'px').css('height', navArea['navHeight'] + 'px');
        // 这个地方要调整
        $('.nav-collection-panel').css('top', ($('.nav-panel').height() - $('.nav-collection-panel').height()) / 2 + 'px');

        // 编辑状态
        if (navArea['edit']) {
            $('.nav-collection').find('img').bind('dragstart', function(e) {
                return false;
            });
        }
    };
    // 重新渲染功能菜单 TODO 调整不同分辨率下块显示问题
    var reRenderNav = function() {
        $('.nav-panel').children().remove();
        var curPage = navArea['curPage'];
        renderNav();
        var width = $(window).width() - $('.metro-nav-panel').width();
        curPage = curPage > navArea['pages'] ? navArea['pages'] : curPage;
        navArea['curPage'] = curPage;
        $('.nav-panel').css('left', -(navArea['curPage'] - 1) * width + 'px');
        // 创建分页栏
        createPagingToolbar();
    };
    // 自适应功能菜单面板区域大小
    var resizeNavArea = function() {
        var width = $(window).width(); //1280
        var height = $('.nav-panel').height(); //709
        //var _unit = 200;	// 功能菜单所在的单位宽度和高度
        /*var _turn_btn_width = 220;	// 两侧翻页按钮所在的宽度
        var _width_7 = _unit*7 + 10*7 + _turn_btn_width;
        var _width_6 = _unit*6 + 10*7 + _turn_btn_width;
        var _width_5 = _unit*5 + 10*6 + _turn_btn_width;
        var _width_4 = _unit*4 + 10*5 + _turn_btn_width;
        var _width_3 = _unit*3 + 10*4 + _turn_btn_width;
        var _width_2 = _unit*2 + 10*3 + _turn_btn_width;
        var _height_3 = _unit*3 + 10*4;
        var _height_2 = _unit*2 + 10*3;
        var _height_1 = _unit + 10*2;*/

        var _unit_height = 140;
        var _unit_width = 180;
        var _turn_btn_width = 220; // 两侧翻页按钮所在的宽度
        var _width_7 = _unit_width * 7 + 10 * 7 + _turn_btn_width; //1270
        var _width_6 = _unit_width * 6 + 10 * 7 + _turn_btn_width; //1130
        var _width_5 = _unit_width * 5 + 10 * 6 + _turn_btn_width; //980
        var _width_4 = _unit_width * 4 + 10 * 5 + _turn_btn_width; //730
        var _width_3 = _unit_width * 3 + 10 * 4 + _turn_btn_width; //680
        var _width_2 = _unit_width * 2 + 10 * 3 + _turn_btn_width; //530
        var _height_3 = _unit_height * 3 + 10 * 4; //610
        var _height_2 = _unit_height * 2 + 10 * 3; //460
        var _height_1 = _unit_height * 1 + 10 * 2; //310

        var nav_width = _width_5;
        var nav_height = _height_2;
        if (width >= _width_7 && height >= _height_3) {
            nav_width = _width_7;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 7;
        } else if (width >= _width_7 && height >= _height_2) {
            nav_width = _width_7;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 7;
        } else if (width >= _width_7 && height < _height_2) {
            nav_width = _width_7;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreaColNumel'] = 7;
        } else if (width >= _width_6 && height >= _height_3) {
            nav_width = _width_6;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 6;
        } else if (width >= _width_6 && height >= _height_2) {
            nav_width = _width_6;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 6;
        } else if (width >= _width_6 && height < _height_2) {
            nav_width = _width_6;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreaColNumel'] = 6;
        } else if (width >= _width_5 && height >= _height_3) {
            nav_width = _width_5;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 5;
        } else if (width >= _width_5 && height >= _height_2) {
            nav_width = _width_5;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 5;
        } else if (width >= _width_5 && height < _height_2) {
            nav_width = _width_5;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreaColNumel'] = 5;
        } else if (width >= _width_4 && height >= _height_3) {
            nav_width = _width_4;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 4;
        } else if (width >= _width_4 && height >= _height_2) {
            nav_width = _width_4;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 4;
        } else if (width >= _width_4 && height < _height_2) {
            nav_width = _width_4;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreaColNumel'] = 4;
        } else if (width >= _width_3 && height >= _height_3) {
            nav_width = _width_3;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 3;
        } else if (width >= _width_3 && height >= _height_2) {
            nav_width = _width_3;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 3;
        } else if (width >= _width_3 && height < _height_2) {
            nav_width = _width_3;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreaColNumel'] = 3;
        } else if (width >= _width_2 && height >= _height_3) {
            nav_width = _width_2;
            nav_height = _height_3;
            navArea['navAreaRowNumel'] = 3;
            navArea['navAreaColNumel'] = 2;
        } else if (width >= _width_2 && height >= _height_2) {
            nav_width = _width_2;
            nav_height = _height_2;
            navArea['navAreaRowNumel'] = 2;
            navArea['navAreaColNumel'] = 2;
        } else {
            nav_width = _width_2;
            nav_height = _height_1;
            navArea['navAreaRowNumel'] = 1;
            navArea['navAreacolNumel'] = 2;
        }
        nav_width = nav_width - _turn_btn_width;
        $(".nav-collection").stop().animate({
            width: nav_width + "px",
            height: nav_height + "px"
        }, 100);
        $('.nav-collection-panel').css('width', width + 'px').css('top', ($('.nav-panel').height() - $('.nav-collection-panel').height()) / 2 + 'px');
        navArea['navWidth'] = nav_width;
        navArea['navHeight'] = nav_height;
        navArea['top'] = ($('.nav-panel').height() - $('.nav-collection-panel').height()) / 2;
    };
    var resizeMainFrame = function() {
        var width = $(window).width();
        var height = $(window).height();
        var metro_nav_width = $('.metro-nav-panel').width();
        var title_height = $('.content-right-head').height();
        $('.metro-main-frame').css('height', height - title_height).css('width', width - metro_nav_width);
        $('.metro-mainframe-panel').css('width', width - metro_nav_width);
    };
    // 计算有磁贴功能的function
    var setTileFuncId = function() {
        var ids = "";
        var datas = navArea['MetroNavDatas'];
        var len = datas.length;
        var n = 0;
        for (var i = 0; i < len; i++) {
            var data = datas[i];
            if (data['notifier'] != undefined && data['notifier'] != '') {
                ids += data['functionId'] + ",";
                n++;
            }
        }
        if (len > 0) ids = ids.substring(0, ids.length - 1);
        navArea['tileFuncId'] = ids;
    };
    // 渲染磁贴消息
    var renderPortletNotifier = function(data) {
        var nav_area_panel = $('.nav-panel').find('.nav-area-panel[func_id="' + data['functionId'] + '"]');
        if (nav_area_panel.attr('id') == undefined) return;
        // 磁帖消息
        if (data['tile'] != undefined) {
            var tile = isNaN(data['tile'] - 0) ? (data['tile'] - 0) : data['tile'];
            var nav_area_tile = $(nav_area_panel).find('.nav-area-tile');
            if (nav_area_tile.attr('class') == undefined) {
                nav_area_tile = $('<div class="nav-area-tile"></div>');
                nav_area_panel.append(nav_area_tile);
            }
            nav_area_tile.html(data['tile']);
            if (tile > 99) {
                nav_area_tile.css('right', '3px').text('99+');
            } else {
                nav_area_tile.text(tile);
            }
        }
        // 内容
        if (data['content'] != undefined) {
            nav_area_panel.html(data['content']);
        }
        // 链接
        if (data['url'] != undefined && data['url'] != '') {
            $(nav_area_panel).click(function(e) {
                if (data['url'] != undefined && data['url'] != '') {
                    showFunctionWindow(data['id'], data['name'], data['url']);
                }
            }).css('cursor', 'pointer');
        }
    };
    // 加载磁贴消息
    var loadPortletNotifier = function() {
        if (navArea['tileFuncId'] == undefined || navArea['tileFuncId'].length == 0) return false;
        clearTimeout(timeout_PortletNotifier); // 关闭定时器
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_load_portlet_notifier', {
            ids: navArea['tileFuncId']
        }, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                var datas = responseObject['data']['portletNotifier'];
                var len = datas.length;
                for (var i = 0; i < len; i++) {
                    var data = datas[i];
                    renderPortletNotifier(data); // 渲染磁贴消息
                }
            }
            timeout_PortletNotifier = window.setTimeout(loadPortletNotifier, 60 * 60 * 1000); // 隔60分钟加载一次
        }, 'json');
    };
    var loadData = function() {
        clearTimeout(timeout_PortletNotifier); // 关闭定时器
        $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_get_metro_nav', {}, function(responseObject) {
            if (responseObject['result'] == 'ok') {
                navArea['MetroFreezeNavDatas'] = responseObject['data']['metroFreezeNavs'];
                navArea['MetroNavDatas'] = responseObject['data']['metroNavs'];
                resizeNavArea(); // 重置功能块大小
                renderNav(); // 渲染功能块
                createPagingToolbar(); // 创建分页栏
                setTileFuncId(); // 计算有磁贴功能的function
                loadPortletNotifier(); // 定时加载磁贴消息
            } else {
                $.simpleAlert(responseObject['msg'], responseObject['result']);
            }
        }, 'json');
    };
    // 显示功能窗口
    var showFunctionWindow = top.window.showFunctionWindow = window.showFunctionWindow = function(id, name, url, refresh) {
        url = encodeURI(url);
        if (refresh == undefined) refresh = false;
        // 验证是否已打开
        var iframeObj = $('.metro-main-frame[functionId="' + id + '"]');
        if (iframeObj.length == 1) {
            if (refresh) {
                iframeObj.attr('src', url);
            }
            iframeObj.parent().siblings().removeClass('current');
            iframeObj.parent().addClass('current').fadeIn();
        } else { // 未打开，打开一个新的iframe
            $('.metro-mainframe-panel').removeClass('current').hide(); // 隐藏其他的窗口
            var count = $('.metro-mainframe-panel').length;
            var newWinPanel = $('.metro-mainframe-panel').first();
            if (count > 1 || (newWinPanel.children('.metro-main-frame').attr('src') != '' && newWinPanel.children('.metro-main-frame').attr('src') != undefined)) {
                newWinPanel = $('.metro-mainframe-panel').last().clone(true);
                // 清除其他的元素
                newWinPanel.children().each(function(i) {
                    if (!$(this).hasClass('metro-main-frame-title') && !$(this).hasClass('metro-main-frame') &&
                        !$(this).hasClass('metro-main-frame-return') && !$(this).hasClass('metro-main-frame-return2') && !$(this).hasClass('metro-main-frame-close')) {
                        $(this).remove();
                    }
                });
                $('.metro-mainframe-panel').last().after(newWinPanel);
            }
            newWinPanel.addClass('current').fadeIn().children('.metro-main-frame').attr('src', url).attr('functionId', id);
            iframeObj = $('.metro-main-frame[functionId="' + id + '"]');
        }

        // 需要触发的菜单					
        var postMsgFunArr = postMsgFun.split(",");

        if ($.inArray(id, postMsgFunArr) != -1) {
            //捕获iframe
            var iframe = iframeObj[0].contentWindow;

            //发送消息
            clockArry[id] = setInterval(function() {
                console.log('function ' + id + ' been post');
                //send the message and target URI
                iframe.postMessage(id, oldOAUrl);
            }, 3000);
        }

        $('.metro-mainframe-panel:not(.current)').hide(); // 隐藏非当前显示窗口
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
                $('.metro-mainframe-panel').hide();
            }
            return true;
        });
        $('.metro-nav-lock-container').hide(); // 隐藏锁定图标
        // 打开tab
        addTab(id, name, url);
    };
    // 校验--办公电话
    var validate_telephone = function(value) {
        var reg = /^([\d-]+-)?(\d{3,4}-)?\d{7,8}(-\d{3,4})?$/;
        return !reg.test(value);
    };
    // 校验--电子邮件
    var validate_email = function(value) {
        var reg = /^([a-zA-Z0-9_\-\.])+\@[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)+$/;
        return !reg.test(value);
    };
    // 校验--手机号码
    var validate_mobile = function(value) {
        var reg = /^(1[3458]\d{1})\d{8}$/;
        return !reg.test(value);
    };
    // 校验--办公传真
    var validate_fax = function(value) {
        return validate_telephone(value);
    };
    // 需要用户必须完善的信息
    var requiredUserInfo = function(callback) {
        // if (requiredEmail || requiredOfficeTel || requiredMobile) {
        if (0) {
            // 加载数据
            $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_load_userinfo', {},
                function(responseObject) {
                    var data = responseObject['data']['userInfo']['data'];
                    if (data != null) {
                        $('#updateUserInfoForm').find('input[type="text"]').each(function(i) {
                            var value = data[$(this).attr('name')];
                            $(this).val(value == undefined ? '' : value);
                        });
                    }
                    if (($.trim($('#officeTel').val()) == '' && requiredOfficeTel) ||
                        ($.trim($('#email').val()) == '' && requiredEmail) ||
                        ($.trim($('#mobile').val()) == '' && requiredMobile)) {
                        $("#updateUserInfoDailog").dialog({
                            title: 完善我的联系信息,
                            closable: false,
                            draggable: false,
                            buttons: [{
                                text: 确定,
                                cls: "blue",
                                handler: function() {
                                    if (!isContinue) return;
                                    isContinue = false; // 禁止下次操作
                                    var officeTel = $('#updateUserInfoForm').find('#officeTel').val(); // 办公电话
                                    var email = $('#updateUserInfoForm').find('#email').val(); // 外网邮件
                                    var mobile = $('#updateUserInfoForm').find('#mobile').val(); // 手机号码
                                    var officeFax = $('#updateUserInfoForm').find('#officeFax').val(); // 办公传真
                                    if (requiredOfficeTel && $.trim(officeTel) == '') {
                                        $.simpleAlert('[办公电话]不允许为空', 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if (requiredEmail && $.trim(email) == '') {
                                        $.simpleAlert('[外网邮箱]不允许为空', 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if (requiredMobile && $.trim(mobile) == '') {
                                        $.simpleAlert('[手机号码]不允许为空', 'info');
                                        isContinue = true;
                                        return false;
                                    }

                                    if ($.trim(officeTel) != '' && validate_telephone(officeTel)) { // 验证办公电话
                                        $.simpleAlert(办公电话格式不正确, 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if ($.trim(email) != "" && validate_email(email)) { // 验证外网邮件
                                        $.simpleAlert(外网邮件格式不正确, 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if ($.trim(email) != "" && $.trim(email).length > 40) { // 验证外网邮件
                                        $.simpleAlert(外网邮件不允许超过40位字符, 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if ($.trim(mobile) != '' && validate_mobile(mobile)) { // 验证手机号码
                                        $.simpleAlert(手机号码格式不正确, 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    if ($.trim(officeFax) != '' && validate_fax(officeFax)) { // 验证办公传真
                                        $.simpleAlert(办公传真格式不正确, 'info');
                                        isContinue = true;
                                        return false;
                                    }
                                    var params = $('#updateUserInfoForm').serialize();
                                    $.post('./jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_update_userinfo',
                                        params,
                                        function(responseObject) {
                                            if (responseObject['result'] == 'ok') {
                                                $.simpleAlert(个人信息修改成功, responseObject['result'], 2000, {
                                                    callback: function() {
                                                        $("#updateUserInfoDailog").dialog('close');
                                                        isContinue = true;
                                                        if (typeof callback == 'function') callback();
                                                    }
                                                });
                                            } else {
                                                $.simpleAlert(responseObject['msg'], responseObject['result']);
                                                isContinue = true;
                                            }
                                        }, 'json');
                                }
                            }]
                        });
                    } else {
                        if (typeof callback == 'function') callback();
                    }
                }, 'json');
        } else {
            if (typeof callback == 'function') callback();
        }
    };

    function promptUploadPortrait() {
        // 求真像
        if (isPromptUploadPortrait) {
            $('#uploadUserPortraitBtn').click();

            $('.awsui-popbox-arrow,.awsui-popbox-arrow-inner').show();
            $('#promptUploadPortrait').parent().show();
            $('#uploadUserPortraitBtn,.edit-user-info-portrait,#promptUploadPortrait,.metro-prompt-upload-portrait-close').click(function(e) {
                $('.awsui-popbox-arrow,.awsui-popbox-arrow-inner').hide();
                $('#promptUploadPortrait').parent().hide();
            });
        }
    }
    var init = function() {
        initNavSystem(); // 初始化子系统菜单导航

        if (forceChangePwd) { // 强制修改密码
            $("#updatePasswordDailog").dialog({ // dialog
                title: 修改登录口令,
                closable: false,
                draggable: false,
                buttons: [{
                    text: 确定,
                    cls: "blue",
                    handler: function() {
                        if (!isContinue) {
                            return;
                        }
                        var oldPassword = $('#updatePasswordForm').find('#oldPassword').val();
                        var password = $('#updatePasswordForm').find('#password').val();
                        var confirmPassword = $('#updatePasswordForm').find('#confirmPassword').val();
                        if (oldPassword == '') {
                            $.simpleAlert(请输入旧口令, "info");
                            return false;
                        }
                        //						if (validate_password(oldPassword, "[旧口令]")) {
                        //						    return false;
                        //						}
                        if (password == '') {
                            $.simpleAlert(请输入新口令, "info", 2000);
                            return false;
                        }
                        if (Loginpassword.validateUpdateLoginpassword(password, "[新口令]")) {
                            return false;
                        }
                        if (confirmPassword == '') {
                            $.simpleAlert(请输入确认口令, "info", 2000);
                            return false;
                        }
                        if (oldPassword == password) {
                            $.simpleAlert(新口令不能和旧口令相同, "info", 2000);
                            return false;
                        }
                        if (password != confirmPassword) {
                            $.simpleAlert(新口令和确认口令不一样, "info", 2000);
                            return false;
                        }
                        isContinue = false; // 禁止下次操作
                        var params = $('#updatePasswordForm').serialize();
                        $.post('./jd?sid=' + sid + '&cmd=CLIENT_UPDATE_PASSWORD', params, function(responseObject) {
                            if (responseObject['result'] == 'ok') {
                                forceChangePwd = false;
                                $.simpleAlert(登录口令修改成功, responseObject['result'], 2000, {
                                    callback: function() {
                                        $("#updatePasswordDailog").dialog('close');
                                        $('#updatePasswordForm').get(0).reset();
                                        // 需要用户必须完善的信息
                                        //requiredUserInfo(function() {
                                        promptUploadPortrait(); // 求真像
                                        loadData();
                                        initNotification(); // 初始化通知中心
                                        //});
                                    }
                                });
                            } else if (responseObject['result'] == 'warning') {
                                $.simpleAlert(responseObject['msg'], 'info');
                            } else {
                                $.simpleAlert(responseObject['msg'], responseObject['result']);
                            }
                            isContinue = true;
                        }, 'json');
                    }
                }]
            });
        } else {
            $('#updatePasswordForm').find('.force-change-pwd-tips').remove();
            // 需要用户必须完善的信息
            requiredUserInfo(function() {
                //promptUploadPortrait();		// 求真像
                loadData();
                initNotification(); // 初始化通知中心
            });
        }
        // 如果不允许修改密码
        if (!isSecurityPwdChange) {
            $('#updatePasswordBtn').remove();
        }
        // 需要用户必须完善的信息
        if (requiredEmail) {
            $('#updateUserInfoForm').find('#email').parent().addClass('required');
        }
        if (requiredOfficeTel) {
            $('#updateUserInfoForm').find('#officeTel').parent().addClass('required');
        }
        if (requiredMobile) {
            $('#updateUserInfoForm').find('#mobile').parent().addClass('required');
        }
        // 手势翻页
        $(window).bind('swipeleft', function(e) {
            turnPage(1);
        });
        $(window).bind('swiperight', function(e) {
            turnPage(-1);
        });
        // 左右键进行翻页
        $(window).keydown(function(e) {
            if (e.keyCode == 39 || e.keyCode == 40) {
                turnPage(1);
                return false;
            } else if (e.keyCode == 37 || e.keyCode == 38) {
                turnPage(-1);
                return false;
            }
        });
        resizeMainFrame();
        // 返回
        $('.metro-nav-system-scaling').click(function(e) {
            var mark;
            // 上下滚动
            var moveUp = $('.metro-nav-system-move-up');
            var moveDown = $('.metro-nav-system-move-down');
            // 判断上下滚动是否隐藏
            var moveUpDisplay = moveUp.is(':hidden') ? "none" : "block";
            var moveDownDisplay = moveDown.is(':hidden') ? "none" : "block";
            // 导航菜单
            var container = $('.metro-nav-dir-container');
            var containerDisplay = container.is(':hidden') ? "none" : "block";
            // 主体窗口
            var current = $('.current');

            if ($(this).attr('class') == 'metro-nav-system-scaling') {
                mark = 1;
                // 改成缩进
                $('.metro-nav-panel').width(minisize).find(".nav-name").hide();
                $('.metro-nav-area-panel').width(minisize);
                $('.metro-mainframe-panel').each(function() {
                    if ($(this).is(':hidden')) {
                        $(this).attr("style", "left:" + minisize + "px;display:none;")
                    } else {
                        $(this).attr("style", "left:" + minisize + "px;display:block;")
                    }
                });
                $('.nav-panel').attr("style", "margin-left:" + minisize + "px;");
                // 导航调整
                $('.metro-nav-dir-container').attr("style", "left:" + minisize + "px;display:" + containerDisplay + ";");
                // 样式切换
                $(this).attr("class", "metro-nav-system-scaling2");
            } else {
                mark = 0;
                // 导航栏回复
                $('.metro-nav-panel').width(defaultWidth).find(".nav-name").show();
                $('.metro-nav-area-panel').width(defaultWidth);
                $('.metro-mainframe-panel').each(function() {
                    if ($(this).is(':hidden')) {
                        $(this).attr("style", "left:" + defaultWidth + "px;display:none;")
                    } else {
                        $(this).attr("style", "left:" + defaultWidth + "px;display:block;")
                    }
                });
                $('.nav-panel').attr("style", "margin-left:" + defaultWidth + "px;");
                // 导航调整
                $('.metro-nav-dir-container').attr("style", "left:" + defaultWidth + "px;display:" + containerDisplay + ";");
                // 样式返还
                $(this).attr("class", "metro-nav-system-scaling");
            }

            // 自适应
            resizeNavArea();
            reRenderNav();
            loadPortletNotifier(); // 定时加载磁贴消息
            resizeMainFrame();
            resetNavSystem();
            resizeHead(); // 重置导航

            if (mark == 1) {
                // 上滚动布局调整
                moveUp.attr("style", "left:20px;display:" + moveUpDisplay + ";");
                // 下滚动布局调整
                moveDown.attr("style", "left:20px;display:" + moveDownDisplay + ";");
            } else {
                // 上滚动布局调整
                moveUp.attr("style", "left:83px;display:" + moveUpDisplay + ";");
                // 下滚动布局调整
                moveDown.attr("style", "left:83px;display:" + moveDownDisplay + ";");
            }
        });
        // 关闭
        $('.metro-main-frame-close').click(function(e) {
            // 先取消当前显示快
            $(this).parent().removeClass('current');

            // 如果显示块数大于1，则删除当前块，否则只做隐藏，并且刷新
            var panelObj = $('.metro-mainframe-panel');
            if (panelObj.length == 1) {
                $(this).parent().hide();
            } else {
                $(this).parent().remove();
                panelObj.hide(); // 隐藏
            }
            $('.metro-nav-lock-container').fadeIn(); // 显示锁定图标
        });
        $('#editUserInfoPanel,.metro-nav-panel').click(function(e) {
            $('#editUserInfoPanel').removeClass('show').hide();
            e.stopPropagation(); // 阻止事件冒泡
        });
        // 自适应窗口
        $(window).off("resize.main").on("resize.main", function() {
            resizeNavArea();
            reRenderNav();
            loadPortletNotifier(); // 定时加载磁贴消息
            resizeMainFrame();
            resetNavSystem(); // 重新设置往下移动图标
            resizeHead(); // 重置导航
        });
        // 滚动窗口
        $(document).mousewheel(function(event, delta) {
            turnPage(-delta);
            return false;
        });

        // 阻止导航滚动时同时翻磁贴
        $('.metro-nav-out-container').mousewheel(function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
        // 阻止Dialog和功能窗口的滚动事件冒泡
        $('.metro-nav-dir-container').mousewheel(function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });

        // 手势翻页
        $('.awsui-dialog,.metro-mainframe-panel,.metro-nav-panel').bind('swipeleft', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
        $('.awsui-dialog,.metro-mainframe-panel,.metro-nav-panel').bind('swiperight', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
    };
    top.window.getUserProfileContainer = function(url) {
        var container;
        // 清空iframe中的内容
        try {
            //	        container = window.frames["metroSkinsMainFrame"].document.body;
            //	        container = $('.metro-mainframe-panel.current')[0];
            container = document.body;
            if (container == undefined) {
                container = document.body;
            }
        } catch (e) {
            try {
                // 处理子页面中也存在同名的iframe的问题
                //	            container = window.frames['metroSkinsMainFrame'][0].document.body;
                container = document.body;
            } catch (e1) {}
        }
        return container;
    }
    init();
});
/**
 * 检测应用是否处于运行状态
 * @param appId
 */
function checkAppActive(appId) {
    var isActive = true;
    $.ajax({
        type: 'POST',
        async: false,
        url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.skins.metro_checkactive',
        data: {
            'appId': appId
        },
        success: function(responseObject) {
            if (responseObject['result'] != 'ok') {
                $.simpleAlert(responseObject['msg'], responseObject['result']);
                isActive = false;
            }
        }
    });
    return isActive;
}
/* 
 *  方法:Array.remove(dx) 
 *  功能:根据元素位置值删除数组元素. 
 *  参数:元素值 
 *  返回:在原数组上修改数组 
 *  作者：pxp 
 */
Array.prototype.remove = function(idx) {
    if (isNaN(idx) || idx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[idx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

//注册一个数组，用于存放定时任务变量
var clockArry = {};

//响应事件
window.addEventListener('message', function(event) {
    //	if(event.origin !== oldOAUrl) return;

    if (typeof(event.data) == "string") {
        if (clockArry[event.data]) {
            window.clearInterval(clockArry[event.data]);
            delete(clockArry[event.data]);
        }
    } else {
        console.log(event.data);
        var funcId = Math.random().toString(36).substr(2);
        // 菜单打开
        showFunctionWindow(funcId, event.data.title, oldOAUrl + event.data.url);
    }
}, false);