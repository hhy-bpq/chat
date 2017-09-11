/**
 * basic.js ,框架基础 可以被自定义组件调用
 * @author Administrator
 */
var errAjaxMsg = "<div class=\"errMsg\">数据出错或服务器正忙，请稍候重新尝试！</div>";
var openWindowId = "winOpenId";
var openWindowId2 = "winOpenId2";
var alertWindowId = "alertWinOpenId";
var modal = "modal";
var msgTitleStyle = "alert-info";
var msgDefaultTitle = "系统提示";
var rootIcon = "home.png";
var listGridId = "listGrid";
var arrays = [];
var showNameArrays = [];
var confirm = true;
var openInputWindowId = "openInputWindowId";

/**
 * 国际化 语言切换
 * 
 */
function changeLang(proName,lang){
    //后台
    $.ajax({
	type: "post",
	url: proName +"/sysInfo/changeLang.do",
	data: "lang=" + lang,
	dataType:"json",
	cache: false,
	success: function(data) {
	    window.location.reload();
	},
	error: function(data, error) {
	    showErrorMsg("change lang error!",error);
	}	
    });
}

/**
 * 获取语言环境
 * 
 */
function getLocale(){
  //如果cookie里有语言的设置就用cookie里的，如果没有就用浏览器的语言
    var lang = navigator.language || navigator.browserLanguage;
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == 'language') {
            lang = unescape(temp[1]);
        }
    }
    lang = lang.toLowerCase();
    if(lang == "zh" || lang=="zh-cn" || lang=="zh_cn"){
        lang = "zh_CN";
    }else{
        lang = "en_US";
    }
    return lang;	
}

/**
 * 左侧菜单展开和折叠
 */
function handle_side_menu() {
    $("#menu-toggler").on(ace.click_event,
        function () {
            $("#sidebar").toggleClass("display");
            $(this).toggleClass("display");
            return false;
        });
    var b = $("#sidebar").hasClass("menu-min");
    var a = "ontouchend" in document;
    $(".nav-list").on(ace.click_event,
        function (g) {
            var f = $(g.target).closest("a");
            if (!f || f.length == 0) {
                return;
            }
            if (!f.hasClass("dropdown-toggle")) {
                if (b && ace.click_event == "tap" && f.get(0).parentNode.parentNode == this) {
                    var h = f.find(".menu-text").get(0);
                    if (g.target != h && !$.contains(h, g.target)) {
                        return false;
                    }
                }
                return;
            }
            var d = f.next().get(0);
            if (!$(d).is(":visible")) {
                var c = $(d.parentNode).closest("ul");
                if (b && c.hasClass("nav-list")) {
                    return;
                }
                c.find("> .open > .submenu").each(function () {
                    if (this != d && !$(this.parentNode).hasClass("active")) {
                        $(this).slideUp(200).parent().removeClass("open")
                    }
                })
            } else {
            	
            }
            if (b && $(d.parentNode.parentNode).hasClass("nav-list")) {
                return false
            }
            $(d).slideToggle(200).parent().toggleClass("open");
            return false
        });
}


/** 
 * 初始化左侧菜单 
 */
function initLeftMenu() {
    var menulist = '';
    menulist += '<ul class="nav nav-list">';
    $.each(_menus.basic, function (i, n) {
        if (n.menus == "") {
            menulist += '<li ><a href="#" rel="' + n.url + '" pos="' + n.menuname + '" class="dropdown-toggle">&nbsp;&nbsp;&nbsp<i class="' + n.icon 
            	+ '  gb_icon p_icon"></i><span class="menu-text">' + n.menuname + '</span></a></li>';
        } else {
            menulist += '<li><a href="#" rel="' + n.url + '" pos="' + n.menuname + '" class="dropdown-toggle">&nbsp;&nbsp;&nbsp<i class="' + n.icon 
            	+ '  gb_icon p_icon"></i><span class="menu-text">' + n.menuname + '</span><b class="arrow icon-angle-down"></b></a>' + initSubMenu(n) + '</li>';
        }
    });
    menulist += '</ul>';
    return menulist;
}

/** 
 * 加载左侧菜单的子菜单 
 * @param menu 子菜单
 */
function initSubMenu(menu) {
    var subMenulist = '';
    subMenulist += '<ul class="submenu">';
    $.each(menu.menus, function (j, o) {
        subMenulist += '<li><a href="#" rel="' + o.url + '" jsevent="'+ o.jsevent +'" pos="' + menu.menuname + " >> " + o.menuname + '"><i class="' 
        	+ o.icon + '  gb_icon"></i>' + o.menuname + '</a></li>';
    });
    subMenulist += '</ul>';
    return subMenulist;
}

/**
 * 加载main区域页面 
 * @param url 请求url
 * @param location 具体的位置,形如：设备管理>>设备列表
 * @param notNav 面包屑是否显示首页
 * @param jsevent 值为“open”的不刷新底下的列表
 */
function loadMainPage(url, location,notNav,jsevent) {
    var suFn = function(data){
    	$("#mainContent").html(data);
		selfSuit();
    }
    
    if(jsevent=="open"){
    	openWindow(location,url,false);
    }else{
    	loadAjaxData("mainContent", url,null,null,suFn);
    }
    setLocation(url,location,notNav);
}

/**
 * 异步获取ajax数据
 * @param objName 加载数据的容器
 * @param url 请求url
 * @param isTip 是否出现进度条
 * @param dataType 异步请求的数据类型，如json,html,text;默认是text
 * @param suFn 请求成功时执行的函数
 * @param erFn 请求失败时执行的函数
 */
function loadAjaxData(objName, url, isTip, dataType, suFn, erFn) {
	var before = function(){
		$("#"+objName).waiting();
	}
	var after = function(){
		$("#"+objName).waiting("hide");
	}
	if(isNull(dataType)){
		dataType = 'text';
	}
	if(isNull(suFn)){
		suFn = function(data){
			$("#"+objName).html(data);
			//加载带有设备树的右侧数据后自适应一下，后续再优化
			if(objName == "dataInfo"){
				selfSuit();
			}
		}
	}
	if(isNull(erFn)){
		erFn = function(XMLHttpRequest, textStatus, errorThrown){
			$("#"+objName).html(errAjaxMsg);
		}
	}
	if(isNull(isTip)){
		before = null;
		after = null;
	}
    $.ajax({
        url: url,
        cache: false,
        data: '',
        dataType: dataType,
        success: suFn,
		error: erFn,
		beforeSend: before,
		complete: after
    });
}

/**
 * 设置左侧菜单的位置，并用面包屑进行展示
 * @param url 地址
 * @param loacation 具体的位置值，形如：设备管理>>设备列表
 * @param notNav 面包屑是否显示首页
 */
function setLocation(url,location,notNav) {
    // 获取主机地址之后的目录，如： /ssm/index.jsp
    var pathName = window.document.location.pathname;   
    // 获取带"/"的项目名，如：/ssm
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
   
    $(".breadcrumb").empty();
    var pos = new Array();
    pos = location.split(">>");
    var position = "<li>";
    // fix icon-breadcrumb-i-tag
    if(notNav){
    	position += "<a href='javascript:breadcrumbClick(\""+projectName+"/firstPage/index.do\",\""+ $.i18n.prop('basic.opt.homepage') +"\","+ notNav 
    		+")'><i class='glyphicon glyphicon-home'></i>&nbsp;Home</a>";
    }
    $.each(pos, function (index, value) {
    	position += "<a href='javascript:breadcrumbClick(\""+url+"\",\""+location+"\","+notNav+")' ><i class='glyphicon glyphicon-record'></i>&nbsp;"+ value + "</a>";
    })
    position += "</li>";
    $(".breadcrumb").append(position);
}

/**
 * 面包屑点击事件
 * 
 */
function breadcrumbClick(url,location,notNav){
    loadAjaxData("mainContent", url);
    loadMainPage(url, location,notNav,null);
}

/**
 * 弹出对话框
 * @param title 对话框的标题
 * @param url 请求的url
 * @param isRefreshGrid 是否刷新jqGrid表格
 * @param width 弹出框的宽度
 * @param height 弹出框的高度
 */
function openWindow(title, url, isRefreshGrid, width, height) {
	var leaf = title;
	if(!isNull(title)&&title.indexOf(">>")>-1){
		var pos = title.split(">>");
		leaf = pos[pos.length-1];
	}
    openNewWindow(null, leaf, url, isRefreshGrid, width, height);

}
/**
 * 弹出对话框，第二种风格 footName表示底部显示的信息 
 * @param url 请求的url
 * @param isRefreshGrid 是否刷新jqGrid表格
 * @param width 弹出框的宽度
 * @param height 弹出框的高度
 */
function openWindow2(url, isRefreshGrid, width, height) {
    openNewWindow2(null, url, isRefreshGrid, width, height);
}

/**
 * 弹出提示框
 * @param windowId 	提示框的唯一标识id
 * @param alertTitle 提示框标题
 * @param titleStyle 提示框类型，包括错误、提醒、确认三种
 * @param msgString 提示信息
 * @param callback 回调函数
 * @param isConfirm 是否是确定提示框
 * @param args 回调函数参数
 * @param exception 异常栈信息
 * @return false
 */
function openAlertWindow(windowId, alertTitle, titleStyle, msgString,callback,isConfirm,args,exception) {
    if (windowId == null) {
        windowId = alertWindowId;
    }
    var btns="<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\" id=\"cancelBtn\" ><i class='glyphicon glyphicon-remove'></i>"+$.i18n.prop('basic.opt.close')+"</button>";
    if(isConfirm){
     	btns =  "<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\" id=\"cancelBtn\" ><i class='glyphicon glyphicon-remove'></i>"+$.i18n.prop('basic.opt.cancel')+"</button>" +
        "<button type=\"button\" class=\"btn btn-primary\" id='confirmBtn' ><i class='glyphicon glyphicon-ok'></i>"+$.i18n.prop('basic.opt.confirm')+"</button>";
    }
    if ($('#' + windowId).length <= 0) {
        $(".main-content").append(
        	// id=\"myAlertModalId\"	 .alert-dialog	
            "<div class=\"modal fade\" id=\"" + windowId + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n"+
                "    <div class=\"modal-dialog\" >\n"+
                "        <div class=\"modal-content\" style=\"margin:40px;\" >\n"+
                "            <div id=\"modal-header\" class=\"modal-header "+titleStyle+"\">\n"+
                "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n"+
                "                <h4 class=\"modal-title\" id=\"myModalLabel\"></h4>\n"+
                "            </div>\n"+
                "            <div class=\"modal-body alert_info\">\n"+
                "            </div>\n"+
                "            <div class=\"modal-footer\">\n"+
                "            </div>\n"+
                "        </div>\n"+
                "    </div>\n"+
                "</div>"
        );

    }

    $("#"+windowId+" .modal-footer").html(btns);
    if (callback != null){
        $("#"+windowId+" #confirmBtn").click(function(){
        	// fn1()//excute this function fn1,if need params pass it
        	if(!isNull(args)){
        		callback(args);
        	}else{
        		callback(true);
//        		callback(msgString);
        	}
        });
        $("#"+windowId +" #cancelBtn").click(function(){
            callback(false);
        });
    }

    if(!alertTitle){
        alertTitle=msgDefaultTitle;
    }
    $("#"+windowId+" #myModalLabel").html(alertTitle);
    if(titleStyle==null){
        titleStyle=msgTitleStyle;
    }
    $("#"+windowId+" #modal-header").removeClass();
    $("#"+windowId+" #modal-header").addClass("modal-header "+titleStyle);
    $("#"+windowId).on("hidden.bs.modal", function () {//模态框 关闭时 将异常信息也关闭
    	$("#exce_btn").attr("data-content","").popover("hide");
    	})
    if (!isNull(msgString) && (msgString.length != 0)) {
	if(titleStyle=="alert-danger" && exception !=undefined && exception!=null && exception !=""){
	    $("#" + windowId + " .modal-body").html(msgString+"<button id='exce_btn' class='btn_all default_yellow' " +
		"style='float:right;width:30px;height:30px;' title='"+$.i18n.prop('basic.hint.exceinfo')+"' data-container='body' data-toggle='popover'" +
		" data-placement='right' data-content=''><i style='font-size:16px;' class='glyphicon glyphicon-paperclip'></i></button>");
	 
	    //弹出popover 
	    $("#exce_btn").hover(function(){
		$("#exce_btn").attr("data-content",exception).popover("show");
		$(".popover").css("width","450px");
		$(".popover").css("z-index",9999);
		$(".popover").css("word-wrap","break-word"); 
	    },function(){
	    	setTimeout(function(){$("#exce_btn").attr("data-content","").popover("hide");},5000);//等待5秒在让，提示信息消失
		//$("#exce_btn").attr("data-content","").popover("hide");
	    });
	}else{
	    $("#" + windowId + " .modal-body").html(msgString);
	}
    }
    /*
    $("#myAlertModalId").draggable({
    	handle: ".modal-header"
    });*/	
    //获取css中的z-index的值
    //设置新的css，后面弹出的提示框总是位于前面的提示框之前
    var prezIndex = $("#"+windowId).css("z-index")
    $("#"+windowId).css("z-index",parseInt(prezIndex)+1000);
    
    //var prezDialogIndex = $(".alert-dialog").css("z-index");
    //$(".alert-dialog").css("z-index",parseInt(prezDialogIndex)+2);
    
    //圆角控制，取消border-radius
    $("#"+windowId+" #modal-header").css("border-top-right-radius","8px");
    $("#"+windowId+" #modal-header").css("border-top-left-radius","8px");
    $("#"+windowId+" .modal-footer").css("border-bottom-right-radius","8px");
    $("#"+windowId+" .modal-footer").css("border-bottom-left-radius","8px");
    
    $("#" + windowId).modal({
        keyboard: true
    });
    //按钮获取焦点，按回车响应事件
    if(isConfirm){
	setTimeout("$('.modal-footer #confirmBtn').focus();","1000");
    }else{
	setTimeout("$('.modal-footer #cancelBtn').focus();","1000");
    }    
    return false;
}

/**
 * 弹出对话框
 * @param windowId 对话框的唯一标识id
 * @param alertTitle 对话框标题
 * @param url 请求url
 * @param isRefreshGrid 是否刷新jqGrid表格数据
 * @param width 对话框宽度
 * @param height 对话框高度
 * @return false
 */
function openNewWindow(windowId, alertTitle, url,isRefreshGrid, width, height) {
    if (windowId == null) {
        windowId = openWindowId;
    }
    $("#focus").css("display","block");
    if ($('#' + windowId).length <= 0) {
        $(".main-content").append(
        	//id=\"myModalId\"
        	"<input type='text' id='focus' />" + 
        	"<div class=\"modal fade\" id=\"" + windowId + "\"  role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n"+
                "    <div class=\"modal-dialog\" >\n"+
                "        <div class=\"modal-content\" style=\"margin:10px;\" >\n"+
                "            <div id=\"modal-header\" class=\"modal-header alert-info\">\n"+
                "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n"+
                "                <h4 class=\"modal-title\" id=\"myModalLabel\"></h4>\n"+
                "            </div>\n"+
                "            <div class=\"modal-body alert_info\" style='padding: 0'>\n"+
                "            </div>\n"+
                "            <div class=\"modal-footer\" style='margin-top: 2px;'>\n"+
                "<button class=\"btn btn-primary\" data-dismiss=\"modal\" aria-hidden=\"true\"><i class='glyphicon glyphicon-remove'></i>"+$.i18n.prop('basic.opt.close')+"</button>"+
                "            </div>\n"+
                "        </div>\n"+
                "    </div>\n"+
                "</div>"
        );
    } else {
        $('#'+windowId +" .modal-footer").html("<button class=\"btn btn-primary\" data-dismiss=\"modal\" aria-hidden=\"true\"><i class='glyphicon glyphicon-remove'></i>"+$.i18n.prop('basic.opt.close')+"</button>");
    }

    if (alertTitle == null) {
        alertTitle = msgDefaultTitle;
    }
    $("#" + windowId + " #myModalLabel").html(alertTitle);

    if ($('#'+windowId +" .modal-body").html().length != 0) {
        $('#'+windowId +" .modal-body").empty();
    }
    if (url != null) {
        loadAjaxData(windowId+" .modal-body", url);
    }
    $("#" + windowId).modal({
        keyboard: true,				// 设置为true,表示当点击Esc键时模态消失
        backdrop: 'static'			// backdrop类型为Boolean和String;设置backdrop(背景消失/遮盖层消失)为false或者'static'都可以做到，当点击遮盖层时模态不消失
    });
   // $(".modal-dialog").removeAttr("style");
	//实现模态框的拖动
    /*
    $("#myModalId").draggable({
    	handle: ".modal-header"
    });*/    
    $("#focus").focus();
    $("#focus").css("display","none");
    return false;
}

/**
 * 弹出对话框，第二种风格 footName表示底部显示的信息 
 * @param windowId 弹出框唯一标识id
 * @param url 请求url
 * @param isRefreshGrid 是否刷新jqGrid表格
 * @param width 弹出框宽度
 * @param height 弹出框高度
 * @return false
 */
function openNewWindow2(windowId, url,isRefreshGrid,width, height) {
    if (windowId == null) {
        windowId = openWindowId2;
    }
    if ($('#' + windowId).length <= 0) {
        $(".main-content").append(
            "<div class=\"modal fade\" id=\"" + windowId + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n"+
                "    <div class=\"modal-dialog\">\n"+
                "        <div class=\"modal-content\">\n"+
                "            <div class=\"modal-body\" style='padding: 0'>\n"+
                "            </div>\n"+
                "        </div>\n"+
                "    </div>\n"+
                "</div>"
        );
    }

    if ($('#'+windowId +" .modal-body").html().length != 0) {
        $('#'+windowId +" .modal-body").empty();
    }
    if (url != null) {
        loadAjaxData(windowId+" .modal-body", url);
    }
    $("#" + windowId).modal({
        keyboard: true,				// 设置为true,表示当点击Esc键时模态消失
        backdrop: 'static'			// backdrop类型为Boolean和String;设置backdrop(背景消失/遮盖层消失)为false或者'static'都可以做到，当点击遮盖层时模态不消失
    });
   /* $(".modal-body").draggable({
    	handle: ".panel"
    });	//实现模态框的拖动
*/    return false;
}

/**
 * 错误提示框
 * @param msgString 错误信息
 * @param exception 异常信息
 * @return false
 */
function showErrorMsg(msgString,exception) {
    showInfoMsg(msgString, "error",null,null,null,exception);
}

/**
 * 警告提示框
 * @param msgString 警告信息
 * @param fn 回调函数
 * @return false
 */
function showWarningMsg(msgString,fn) {
    showInfoMsg(msgString, "warning",fn);
}

/**
 * 确认提示框
 * @param content 提示信息
 * @param callback 回调函数
 * @param args 回调函数参数
 * @return false
 */
function showConfigMsg(content,callback,args) {
    showInfoMsg(content,"confirm", callback,null,args);
}

/**
 * 信息提示框
 * @param msgString 提示信息
 * @param msgType 提示框类型 
 * @param fn 回调函数
 * @param titleStyle 提示框标题
 * @param args 回调函数参数
 * @return false
 */
function showInfoMsg(msgString, msgType, fn,titleStyle,args,exception) {
    var title;
    var isConfirm=false;
    if (msgType == null || "" == msgType) {
        msgType = "info";
        title = msgDefaultTitle;
        titleStyle = msgTitleStyle;//只有顶部显示圆角效果
    }
    else if (msgType == "error") {
        title = $.i18n.prop('basic.hint.error');//"出错了";
// titleStyle = "alert-error";
        titleStyle = "alert-danger";//只有顶部显示圆角效果
    } else if (msgType == "warning") {
        title = $.i18n.prop('basic.hint.warning');//"警告";
        titleStyle = "alert-warning";//只有顶部显示圆角效果
    }
    else if(msgType == "confirm"){
        title = $.i18n.prop('basic.hint.systemhint');//"系统提示";
        titleStyle = "alert-warning";//只有顶部显示圆角效果
        isConfirm=true;
    }
    openAlertWindow(null,title,titleStyle, msgString,fn,isConfirm,args,exception);
}

/**
 * 调整元素居中
 * @param divName 元素的唯一标识id 
 */
function adjustDivPostionCenter(divName) {
    var postop = ($(document).height() - $("#" + divName).height()) / 2;
    var posleft = ($(window).width() - $("#" + divName).width()) / 2;
    var loginTop = 120;
    if (postop < loginTop) postop = loginTop;
    $("#" + divName).css({"left": posleft + "px", "top": postop + "px"});
    $("#" + divName).show();
}

/** -------- formatter formatter--------- */
/**
 * jqGrid自定义格式函数,设备类型格式化
 * @param cellvalue 当前cell的值
 * @param options 该cell的options设置，包括{rowId, colModel,pos,gid}
 * @param rowObject 当前cell所在row的值，如{ id=1, name="name1", price=123.1, ...}
 * @return string
 */
function devFormFormat(cellvalue, options, rowObject) {
	if(cellvalue=="0"){
		return $.i18n.prop('basic.slt.all');
	}
	if(cellvalue=="1"){
		return $.i18n.prop('basic.slt.gateway');
	}
	if(cellvalue=="2"){
		return "AP";
	}
	return $.i18n.prop('basic.slt.other');
}

/**
 * jqGrid自定义格式函数,开关格式化
 */
function switchFormat(cellvalue, options, rowObject) {
	if(cellvalue=="0"){
		return $.i18n.prop('basic.slt.off');
	}
	if(cellvalue=="1"){
		return $.i18n.prop('basic.slt.on');
	}
	return $.i18n.prop('basic.slt.other');
}

/**
 * jqGrid自定义格式函数,优先级格式化
 */
function priorityFormat(cellvalue, options, rowObject) {
	if(cellvalue=="0"){
		return $.i18n.prop('basic.slt.low');
	}
	if(cellvalue=="1"){
		return $.i18n.prop('basic.slt.medium');
	}
	if(cellvalue=="2"){
		return $.i18n.prop('basic.slt.high');
	}
	return $.i18n.prop('basic.slt.other');
}

/**
 * jqGrid自定义格式函数,根据型号ID 获得型号名称
 */
function sysModelFormat(cellvalue, options, rowObject){
	if(cellvalue=="9001002"){
		return "WA2020";
	}else if(cellvalue=="9001002"){
		return "TA2020SP";
	}else if(cellvalue=="9002001"){
		return "TA2025";
	}else if(cellvalue=="9002001"){
		return "CA2025";
	}else if(cellvalue=="10001001"){
		return "OA2020";
	}else if(cellvalue=="10001001"){
		return "OA2020L";
	}else if(cellvalue=="10001002"){
		return "OA2025";
	}else if(cellvalue=="7004001"){// 网关
		return "CGW500";
	}else if(cellvalue=="7004002"){
		return "CGW500U";
	}else if(cellvalue=="7003001"){
		return "CGW1200";
	}else if(cellvalue=="7003002"){
		return "CGW1200H";
	}else if(cellvalue=="7001002"){
		return "CGW2000";
	}else if(cellvalue=="7001003"){
		return "CGW3000";
	}else if(cellvalue=="7001004"){
		return "CGW3000T";
	}else if(cellvalue=="1200100"){// 网监
		return "DW-CGW1200";
	}else if(cellvalue=="1200200"){
		return "DW-LA2000";
	}else if(cellvalue=="1200300"){
		return "DW-LA1000";
	}else if(cellvalue=="1200400"){
		return "DW-LFC25";
	}else if(cellvalue=="9002003"){// 齐邦定制
		return "CA1020C";
	}else if(cellvalue=="9002003"){
		return "CA2020C";
	}else if(cellvalue=="9002003"){
		return "CA2025C";
	}else if(cellvalue=="9002003"){
		return "TA2020C";
	}else if(cellvalue=="9002003"){
		return "CGW1000";
	}else{
		return "";
	}
	
}

/**
 * jqGrid自定义格式函数,状态格式化
 */
function stateFormat(cellvalue, options, rowObject) {
	if(cellvalue=="1"){
		// $(this).css({text-align:"center",color:"green"});
		return $.i18n.prop('basic.slt.online');
	}
	if(cellvalue=="2"){
		// $(this).css({text-align:"center",color:"red"});
		return $.i18n.prop('basic.slt.offline');
	}
	if(cellvalue=="0"){
		// $(this).css({text-align:"center",color:"red"});
		return $.i18n.prop('basic.slt.offline');
	}
	return $.i18n.prop('basic.slt.unknown');
}
/**
 * jqGrid自定义格式函数,计算版本信息
 */
function oemVersionFormat(cellvalue, options, rowObject) {
	if(cellvalue==""||cellvalue==null){
		// $(this).css({text-align:"center",color:"green"});
		return rowObject['swVersion'];
	}else {
		return cellvalue;
	}
}
/**
 * 软件版本，文件类型显示
 */
function fileTypeFormat(cellvalue, options, rowObject) {
	if(rowObject['fileType'] =="4"||rowObject['fileType'] =="5"||rowObject['fileType'] =="99"||rowObject['fileType'] =="ver"){
		return $.i18n.prop('basic.slt.version');
	}
	if(rowObject['fileType'] =="sh"){
		return $.i18n.prop('basic.slt.script');
	}
	if(rowObject['fileType'] =="config"){
		return $.i18n.prop('basic.slt.config');
	}
	return $.i18n.prop('basic.slt.unknown');
}

/**
 * jqGrid自定义格式函数,布尔值格式化
 */
function booleanFormat(cellvalue, options, rowObject) {
    var yes = $.i18n.prop('basic.slt.yes');
    var no = $.i18n.prop('basic.slt.no');
    return (cellvalue == "true" ||cellvalue == "1")? yes : no;
}

/**
 * jqGrid自定义格式函数,状态格式
 */
function jobStateFormat(cellvalue, options, rowObject) {
	if(cellvalue=="1"){
		return $.i18n.prop('basic.slt.job.queue');//"等待";
	}
	if(cellvalue=="2"){
		return $.i18n.prop('basic.slt.job.running');//"运行";
	}
	if(cellvalue=="3"){
		return $.i18n.prop('basic.slt.job.suspending');//"挂起";
	}
	if(cellvalue=="4"){
		return $.i18n.prop('basic.slt.job.invalidation');//"失效";
	}
	
}
/**
 * jqGrid自定义格式函数,状态格式
 */
function alarmNotifyTypeFormat(cellvalue, options, rowObject) {
	if(cellvalue=="0"){
		return $.i18n.prop('basic.opt.close');//"关闭";
	}
	if(cellvalue=="1"){
		return $.i18n.prop('v3.alarmtpl.Http');//"http通知";
	}
	if(cellvalue=="2"){
		return $.i18n.prop('v3.alarmtpl.sms');//"短信通知";
	}
	if(cellvalue=="3"){
		return $.i18n.prop('v3.alarmtpl.email');//"邮件通知";
	}
	
}
/**
 * jqGrid自定义格式函数,状态格式
 */
function jobLevelFormat(cellvalue, options, rowObject) {
	if(cellvalue=="1"){
		return $.i18n.prop('basic.slt.overall');
	}
	if(cellvalue=="2"){
		return $.i18n.prop('basic.slt.area');
	}
	if(cellvalue=="3"){
		return $.i18n.prop('basic.slt.device');
	}
	
}

/**
 * jqGrid自定义格式函数,状态格式
 */
function validFormat(cellvalue, options, rowObject) {
    return cellvalue == "true" ? $.i18n.prop('basic.slt.valid') : $.i18n.prop('basic.slt.invalid');
}

/**
 * jqGrid自定义格式函数
 */
function userType(cellvalue, options, rowObject) {
	if(cellvalue=="0"){
		return "none";
	}
	if(cellvalue=="1"){
		return "userpasswd";
	}
	if(cellvalue=="2"){
		return "coupon";
	}
	if(cellvalue=="3"){
		return "fixedpasswd";
	}
	if(cellvalue=="4"){
		return "phone";
	}
	if(cellvalue=="5"){
		return "qq";
	}
	if(cellvalue=="6"){
		return "weibo";
	}
	if(cellvalue=="7"){
		return "nopasswd";
	}
	if(cellvalue=="8"){
		return "weixin";
	}
	if(cellvalue=="9"){
		return "alipay";
	}
	return "other";
}

/**
 * jqGrid自定义格式函数，半分比格式
 */
function apppercent(cellvalue, options, rowObject) {
	return cellvalue+"%";
}

/**
 * jqGrid自定义格式函数，安全模式格式函数
 */
function securityMode(cellvalue, options, rowObject) {
	// none(0),wep(1),wpa-psk(2),wpa2-psk(3),psk-mixed(4),wpa(5),wpa2(6),wpa-wpa2-mixed(7)

	if(cellvalue=="0"){
		return "none";
	}
	if(cellvalue=="1"){
		return "open";
	}
	if(cellvalue=="2"){
		return "shared";
	}
	if(cellvalue=="3"){
		return "wpa-psk";
	}
	if(cellvalue=="4"){
		return "wpa2-psk";
	}
	if(cellvalue=="5"){
		return "wpapsk-wap2psk";
	}
	if(cellvalue=="6"){
		return "wpa";
	}
	if(cellvalue=="7"){
		return "wpa2";
	}
	if(cellvalue=="8"){
		return "wpa-wap2";
	}
	return "other";
}

/**
 * jqGrid自定义格式函数，认证类型格式函数
 */
function authTypeFormat(cellvalue, options, rowObject){
	if(cellvalue=="1"){
		return "Disabled";
	}
	if(cellvalue=="2"){
		return "Web";
	}
}

/**
 * jqGrid自定义格式函数，安全模式格式函数
 */
function securityModeFormat(cellvalue, options, rowObject){
	if(cellvalue=="1"){
		return "Open";
	}
	if(cellvalue=="2"){
		return "Shared";
	}
	if(cellvalue=="3"){
		return "Wpa-psk";
	}
	if(cellvalue=="4"){
		return "Wpa2-psk";
	}
	if(cellvalue=="5"){
		return "Wpapsk-wpa2psk";
	}
	if(cellvalue=="6"){
		return "Wpa";
	}
	if(cellvalue=="7"){
		return "Wpa2";
	}
	if(cellvalue=="8"){
		return "wpa-wap2";
	}
}

/**
 * jqGrid自定义格式函数，加密类型格式函数
 */
function encryptTypeFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "None";
	}
	if(cellvalue=="1"){
		return "Tkip";
	}
	if(cellvalue=="2"){
		return "aes";
	}
	if(cellvalue=="3"){
		return "Auto";
	}
}

/**
 * jqGrid自定义格式函数，wepKey格式函数
 */
function wepKeyFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "wep-64bit-16hex";
	}
	if(cellvalue=="1"){
		return "wep-64bit-ascii";
	}
	if(cellvalue=="2"){
		return "wep-128bit-16hex";
	}
	if(cellvalue=="3"){
		return "wep-128bit-ascii";
	}
}

/**
 * jqGrid自定义格式函数,是否可用
 */
function isEableFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "Disabled";
	}
	if(cellvalue=="1"){
		return "Enable";
	}
}

/**
 * jqGrid自定义格式函数，是否广播
 */
function isBroadcastFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "On";
	}
	if(cellvalue=="1"){
		return "Off";
	}
}

/**
 * jqGrid自定义格式函数，信道模式
 */
function channelBGNModeFormat(cellvalue, options, rowObject){
	if(cellvalue=="2"){
		return "b";
	}
	if(cellvalue=="3"){
		return "g";
	}
	if(cellvalue=="6"){
		return "bg";
	}
	if(cellvalue=="16"){
		return "n";
	}
	if(cellvalue=="20"){
		return "g-gn";
	}
	if(cellvalue=="22"){
		return "bgn";
	}
}

/**
 * jqGrid自定义格式函数，信道状态
 */
function channelStateFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "Static"
	}
	if(cellvalue=="1"){
		return "Auto";
	}
}

/**
 * jqGrid自定义格式函数
 */
function bwModeFormat(cellvalue, options, rowObject){
	if(cellvalue=="0"){
		return "bw20MHz"
	}
	if(cellvalue=="1"){
		return "Auto";
	}
	if(cellvalue=="2"){
		return "bw40Hz";
	}
}

/**
 * jqGrid自定义格式函数
 */
function channelANModeFormat(cellvalue, options, rowObject){
	if(cellvalue=="1"){
		return "dot11a"
	}
	if(cellvalue=="8"){
		return "dot11n";
	}
	if(cellvalue=="9"){
		return "dot11a-an";
	}
}

/**
 * jqGrid自定义格式函数
 */
function ipModeFormat(cellvalue, options, rowObject){
	if(cellvalue=="1"){
		return "Static";
	}
	if(cellvalue=="2"){
		return "DHCP";
	}
}

/**
 * for grid netsiteType
 * 审计模块-场所基本信息-服务类型
 */
function netsiteTypeFormat(cellvalue, options, rowObject){
    if(cellvalue=="1"){
	return $.i18n.prop('basic.slt.hotel');
    }else if(cellvalue=="2"){
	return $.i18n.prop('basic.slt.library');
    }else if(cellvalue=="3"){
	return $.i18n.prop('basic.slt.computerlearn');
    }else if(cellvalue=="4"){
	return $.i18n.prop('basic.slt.recreation');
    }else if(cellvalue=="5"){
	return $.i18n.prop('basic.slt.hinge');
    }else if(cellvalue=="6"){
	return $.i18n.prop('basic.slt.publictransport');
    }else if(cellvalue=="7"){
	return $.i18n.prop('basic.slt.repast');
    }else if(cellvalue=="8"){
	return $.i18n.prop('basic.slt.finance');
    }else if(cellvalue=="A"){
	return $.i18n.prop('basic.slt.shopping');
    }else if(cellvalue=="B"){
	return $.i18n.prop('basic.slt.publicserver');
    }else if(cellvalue=="C"){
	return $.i18n.prop('basic.slt.culture');
    }else if(cellvalue=="D"){
	return $.i18n.prop('basic.slt.publicrelaxation');
    }else{
	return $.i18n.prop('basic.slt.other');
    }
}

/**
 * 审计模块-场所基本信息-状态
 */
function statusFormat(cellvalue,options,rowObject){
    if(cellvalue == "1"){
	return $.i18n.prop('basic.slt.normal');
    }else if(cellvalue == "2"){
	return $.i18n.prop('basic.slt.maintain');
    }else if(cellvalue == "3"){
	return $.i18n.prop('basic.slt.cancel');
    }
}

/**
* jqGrid自定义格式函数,告警等级格式
*/
function levelFormat(cellvalue,options,rowObject){
    if(cellvalue == "1"){
	return $.i18n.prop('basic.slt.deadly');
    } else if(cellvalue == "2"){
	return $.i18n.prop('basic.slt.serious');
    } else if(cellvalue == "3"){
	return $.i18n.prop('basic.slt.warning');
    } else if(cellvalue == "4"){
	return $.i18n.prop('basic.slt.secondary');
    }else{
	return $.i18n.prop('basic.slt.unknown');
    }
}

/**
* jqGrid自定义格式函数:是否邮件通知
*/
function mailFormat(cellvalue,options,rowObject){
	if(cellvalue == "false"){
		return $.i18n.prop('basic.slt.no');
	}
	if(cellvalue == "true"){
		return $.i18n.prop('basic.slt.yes');
	}
}

/**
* jqGrid自定义格式函数,时间格式函数
*/
function dateFormat(cellvalue,options,rowObject){
    var date = new Date(cellvalue);
    var timestamp = date.getTime()-6*60*60*1000;
    date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(month < 10){
	month = "0"+month;
    }
    if(day < 10){
	day = "0"+day;
    }
    if(hour < 10){
	hour = "0"+hour;
    }
    if(minute < 10){
	minute = "0"+minute;
    }
    if(second < 10){
	second = "0"+second;
    }
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}

/**
* jqGrid自定义格式函数：关注功能
*/
function attentionFormat(cellvalue,options,rowObject) {
	var cell = rowObject.id;
	if(rowObject['attentionKey'] ==1){
		cell = '<span class="badge badge-warning">'+options.rowId+'</span>';
	}else if(rowObject['attentionKey'] ==2){
		cell = '<span class="badge badge-important">'+options.rowId+'</span>';
	}else{
		cell = '<span class="badge">'+options.rowId+'</span>';
	}
	// data-toggle="tab" data-target="#foo" 
	return '<a data-toggle="tab" data-action="open"  onclick="doAttention(' + rowObject.id + ')">'+cell+'</a>';
}


/**
 * 设备列表中热点名称格式化
 */
function apLinkedFormat(cellValue,options,rowObject){
	return "<a href=\"javascript:void(0);\" id=\"jqgrid_hover\" onclick=\"doView('" + rowObject.id + "')\">"+cellValue+"</a>"
}

/** ---- cellAttr ---- */
/**
 * 为jqGrid单元格添加属性，如果单元格值为"在线"，则显示为"绿色"，如果单元格值为"离线"，则显示为"红色"
 */
function stateCellAttr(rowId, val, rawObject) {
	 if (val == $.i18n.prop('basic.slt.online')) {
		 //text-align:center;color:red;font-weight:bold
	     return "style='color:green;font-weight:bold'";
	 }
	 if (val == $.i18n.prop('basic.slt.offline')) {
         return "style='color:red;font-weight:bold'";
     }
}

/**
 * 表单验证初始化
 * @param conditions 表单验证条件 
 * @param formName 表单id
 * @param settings 自定义配置
 */
function validateInit(conditions, formName,settings) {
    for (var i = 0; i < conditions.length; i++) {
        var cond = conditions[i];
        // 下面两个效果相同 data-validation-engine=rule 和 class = rule 相同，不推荐是class
		// 可嗯呢该会影响css
        $("#" + formName + " [name=" + cond.name + "]").attr("data-validation-engine", cond.rule);
        // $("#bean [name=" + cond.name + "]").addClass(cond.rule);
    }
    var defSettings = {
        	// validationEventTriggers:"blur", //触发的事件
    		// validationEventTriggers:"keyup blur",
        	// inlineValidation: true,//是否即时验证，false为提交表单时验证,默认true
        	
        	scroll:true,    // 屏幕自动滚动到第一个验证不通过的位置
        	focusFirstField:true,    // 验证未通过时，是否给第一个不通过的控件获取焦点
            promptPosition: "bottomRight",
            isOverflown: true,
            overflownDIV: "#winOpenId"
        };
    if(!isNull(settings)){
    	$.extend(defSettings,settings);
    }
    // 注册表单验证事件，会自动根据rule进行校验
    $("#" + formName).validationEngine('attach', defSettings);
}

/**
 * 验证表单
 * @param formName 表单id
 */
function validateForm(formName) {
	// $("#" + formName).validationEngine('validate'); 等效
    return $("#" + formName).validationEngine('validateform');
}

/**
 * 表单存储
 * 
 * @param url 请求url
 * @param formId 表单id
 * @param callbackFunc 回调函数  无论成功失败都会调用，异常情况下也调用，需要手动排毒按 val是否为空
 * @param opts(
 * 				showLoading  是否显示进度提示，默认显示，false表示不显示
 * 				showSuccessInfo 是否显示成功提示信息，默认显示，false表示不显示
 * 				windowId     关闭对话框的ID
 * 				gridId		 刷新表格的ID
 * 				zTreeId		 刷新树的ID
 * 				successFnc   请求成功后自定义的函数，参数为现有的数据，参数可选  //仅成功才调用
 *				errorFnc	 请求失败后自定义的函数，参数为现有的数据，参数可选 	
 *				参数可以继续扩展		
 *			  )
 * 
 */
function saveAjaxData(url, formId, callbackFunc, opts) {
    // if (formId == null || "" == formId)formId = "bean";
    var defaultOpts = {
	showLoading: true,
	showSuccessInfo: true,
	closeWindow: true,
	refreshGrid: true,
	refreshTree: true,
	successFnc: null,
	errorFnc: null
    };
    opts = $.extend(defaultOpts, opts||{});
    if (formId != null) {
    	try{
    	    if($("#"+formId).length>0){
    		sendData = $("#" + formId).serializeArray();
    	    }
    	}catch(e){
    	    sendData = formId;
    	}
    }else{
    	sendData = null;
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: sendData,
        dataType: 'json',
        success: function (data) {
	    if(opts.showLoading === true){
	    	$("body").waiting("hide");
	    }
	    var isCallBackExec = false;
	    if(opts){
    		isCallBackExec = opts.showSuccessInfo;
	    }
            if (data.success) {
                if (opts.showSuccessInfo === true) {
                    showInfoMsg(data.msg, null, callbackFunc);
                }
                if(!isNull(opts.successFnc)){
                	opts.successFnc(data.val);
                }
                if (opts.closeWindow) {
                    closeWindow();
                }
                if (opts.refreshGrid) {
                	refreshGrid()
                }
                if (opts.refreshTree) {
                	refreshTree()
                }

            } else {
            	if(!isNull(opts.errorFnc)){
            		opts.errorFnc(data.val);
            	}
                showErrorMsg(data.msg,data.val);
            }
            if (callbackFunc && !isCallBackExec) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(data.val);
                } else {
                    eval(callbackFunc);
                }
            }
        },
        error: function (xmlR, status, e) {
            if (callbackFunc && !isCallBackExec) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(data.val);
                } else {
                    eval(callbackFunc);
                }
            }
            $("body").waiting("hide");
            showErrorMsg(xmlR.responseText,e);
           // openNewWindow("errorWindow", "错误", null, false, 600, 400);
            // $("#errorWindow").panel("body").html("[" + e + "]" +
			// xmlR.responseText);
        },
        beforeSend: function(){
            if(opts.showLoading === true){
            	$("body").waiting();
            }
        }
    });
}


/**
 * 上传文件
 * @param url 请求url
 * @param formId 表单id
 * @param callbackFunc 回调函数
 * @param opts(
 * 				showLoading  是否显示进度提示，默认显示，false表示不显示
 * 				showSuccessInfo 是否显示成功提示信息，默认显示，false表示不显示
 * 				windowId     关闭对话框的ID
 * 				gridId		 刷新表格的ID
 * 				zTreeId		 刷新树的ID
 * 				successFnc   请求成功后自定义的函数，参数为现有的数据，参数可选
 *				errorFnc	 请求失败后自定义的函数，参数为现有的数据，参数可选 	
 *				upFile      页面原始ID，不指定默认是upFile ，可以指定
 *				参数可以继续扩展		
 *			  )
 * 
 */
function saveAjaxFileUpload(url,formId, callbackFunc, opts){
	var defaultOpts = {
			showLoading: true,
			showSuccessInfo: true,
			closeWindow: true,
			refreshGrid: true,
			refreshTree: true,
			successFnc: null,
			errorFnc: null
	};
	opts = $.extend(defaultOpts, opts||{});
	var sendData = "";
    if (formId != null) {
    	try{
    		if($("#"+formId).length>0){
    			sendData = $("#" + formId).serializeArray();
    		}
    	}catch(e){
    		sendData = formId;
    	}
    }else{
    	sendData = null;
    }
	var eleId = 'upFile';
    if(opts.upFile){
    	eleId = opts.upFile;
    }
	$.ajaxFileUpload({
		url: url,
		secureuri:false, 
		fileElementId: eleId,
		data: sendData,
		dataType:'json', 
		success:function(data){
			
			if(opts.showLoading === true){
	    		$("body").waiting("hide");
	    	}
			var isCallBackExec = false;
			if(opts){
				isCallBackExec = opts.showSuccessInfo;
			}
	        if (data.success) {
	            if (opts.showSuccessInfo === true) {
	                showInfoMsg(data.msg, null, callbackFunc);
	            }
	            if(!isNull(opts.successFnc)){
	            	opts.successFnc(data.val);
	            }
	            if (opts.closeWindow) {
	                closeWindow();
	            }
	            if (opts.refreshGrid) {
	            	refreshGrid()
	            }
	            if (opts.refreshTree) {
	            	refreshTree()
	            }
	
	        } else {
	        	if(!isNull(opts.errorFnc)){
	        		opts.errorFnc(data.val);
	        	}
	            showErrorMsg(data.msg,data.val);
	        }
	        if (callbackFunc && !isCallBackExec) {
	            if ($.isFunction(callbackFunc)) {
	                callbackFunc(data.val);
	            } else {
	                eval(callbackFunc);
	            }
	        }
		},
		error:function(reponesText,status,e){
			$("body").waiting("hide");
			showErrorMsg( $.i18n.prop('basic.hint.uploadfail') ,e);
		},
        beforeSend: function(){
        	if(opts.showLoading === true){
        		$("body").waiting();
        	}
        }
	});
};


/**
 * 关闭弹出框
 * @param windowId 弹出框的id 
 */
function closeWindow(windowId) {
// var windowStack = $(window.top).data("windowStack");
// if ($.isArray(windowStack)) {
// while (windowStack && windowStack.length > 0) {
// var win = windowStack.pop();
// if ($(win).length && !($(win).window("options").closed)) {
// $(win).window('close');
// break;
// }
// }
// }
    if (windowId == null) windowId = openWindowId;
    if ($('#' + windowId).length <= 0) return;
    $('#' + windowId).modal('hide');
}

/**
 * 关闭提示框
 */
function closeAlertWindow(){
	$("#myAlertModalId").parent().modal('hide');
}

/**
 * 添加图标名称，主要是用于设备树的图标更改
 * @param icons 图标名称
 * @return string
 */
function addIcons(icons) {
    return rootIcon + "," + icons;
}

/**
 * 调整jqGrid表格宽度
 */
function resizeGrid() {
    setTimeout(function () {
        $("#listGrid").setGridWidth($("#dataInfo").width() - 5);
    }, 500);
}

/**
 * 设置layout的大小
 */
function initSize() {
    $("#layout").height($("html").height() - $(".navbar").outerHeight() - $("#breadcrumbs").outerHeight()-84);
}

/**
 * 禁止按钮再次点击
 * @param btn 按钮
 * @param showName 显示名称
 */
function disableBtn(btn, showName) {
    if (showName == null) showName = $.i18n.prop('basic.hint.wait');
    btn.value = showName;
    btn.disabled = true;
}

/**
 * 刷新jqGrid表格
 * @param gridId 表格id
 */
function refreshGrid(gridId) {
    if (gridId == null)gridId = listGridId;
    if ($('#' + gridId).length <= 0) {
	    if($("#listGrid1").length<=0)return;
		$("#listGrid1").trigger("reloadGrid");
    }else{
    	$("#" + gridId).trigger("reloadGrid");
    }    
}

/**
 * 删除列表记录
 * @param url 请求url
 * @param msg 删除前提示信息
 * @param opts 自定义配置
 */
function doGridDelete(url, msg, opts) {
    if (msg == null) msg = $.i18n.prop('basic.hint.isdelete');//"您确定要删除此记录吗?";
    showConfigMsg( msg, function (r) {
        if (r) {
            saveAjaxData(url, null, null, opts);
        }
    });
}

/**
 * 清空列表记录
 * @param url 请求url
 * @param msg 删除前提示信息
 * @param opts 自定义配置
 */
function doGridClear(url, msg, opts) {
    if (msg == null) msg = $.i18n.prop('basic.hint.isempty');//"您确定要清空此配置吗?";
    showConfigMsg( msg, function (r) {
        if (r) {
            saveAjaxData(url, null, null, opts);
        }
    });
}

/*//同步列表记录
function doGridSync(url, msg, opts) {
    if (msg == null) msg = "您确定要同步数据吗?";
    showConfigMsg( msg, function (r) {
        if (r) {
            saveAjaxData(url, null, null, opts);
        }
    });
}*/

/**
 * 选择日历
 * @param objName 对象
 * @param dateType 日历格式
 */
function calendar(objName, dateType) {
    var json = "";
    if (dateType != null) {
        if ('all' == dateType) {
            json += "dateFmt:'yyyy-MM-dd HH:mm:ss'";
        } else if ('datetime' == dateType) {
            json += "dateFmt:'yyyy-MM-dd HH:mm'";
        } else {
            json += "dateFmt:'yyyy-MM-dd'";
        }
    }
    if (objName != null && objName != "") {
        if (json != "") {
            json = "el:'" + objName + "'," + json;
        } else {
            json = "el:'" + objName + "'";
        }
    }
    if (json != "") json = "{" + json + "}";
    WdatePicker(eval("(" + json + ")"));
}

/**
 * 将表单数据，序列化为数组格式
 * @param formId 表单id
 * @return array
 */
function serializerToArray(formId){
	return $("#" + formId).serializeArray();
}

/**
 * ajax 导出文件 ctx 下载url前缀 ctx used ctxpath can not use 
 * @param url 请求url
 * @param ctx 工程前缀路径
 * @param callbackFunc 回调函数
 */
function downAjaxFile(url1,ctx,callbackFunc) {
    var genURL = url1;
    if(url1==null){
        return;
     }
    if(callbackFunc ==null){
    	callbackFunc = function(data){
    	    if(data.success){
		window.open(ctx+"/componentData/downFile.do?path="+data.val);// 统一下载
    	    }else{
		showErrorMsg(data.msg,data.val);
    	    }
	};
    }
    $.ajax({
	dataType : "json",
	url : genURL,
	success : function(data) {
	    $("body").waiting("hide");
	    closeWindow();
	    callbackFunc(data);
	},
	error : function(reponseText,status,e){
	    $("body").waiting("hide");
	    closeWindow();
	    showErrorMsg( $.i18n.prop('basic.hint.createfail') ,e);
	},
	beforeSend: $("body").waiting()
    });
}

/**
 * 获取浏览器可视窗口大小
 */
function pageSize() {
    var winW, winH; 
    if(window.innerHeight) {// all except IE
         winW = window.innerWidth; 
         winH = window.innerHeight; 
    } else if (document.documentElement && document.documentElement.clientHeight) {// IE 6
																					// Strict
																					// Mode
         winW = document.documentElement.clientWidth; 
         winH = document.documentElement.clientHeight; 
    } else if (document.body) { // other
         winW = document.body.clientWidth; 
         winH = document.body.clientHeight; 
    }  // for small pages with total size less then the viewport
    return {WinW:winW, WinH:winH}; 
}

/**
 * 获取时间格式为yyyy/MM/dd HH:mm:ss
 * @param formattime 格式时间
 * @return string 格式化后的时间字符串
 */
function getFormatTime(formattime){
	var datetime = getYMDTime();
	var hmtime = getHMTime(formattime);
	datetime = datetime+" "+hmtime;
	return datetime;
}

/**
 * 获取时间格式为HH:mm:ss
 * @param formattime 格式时间
 * @return 格式化后的时间字符串
 */
function getHMTime(formattime){
	var date = new Date();
	date.setTime(formattime-28800000);
	var hour = date.getHours();
	if(hour<10){
		hour = "0"+hour;
	}
	var minute = date.getMinutes();
	if(minute<10){
		minute = "0"+minute;
	}
	datetime = hour+":"+minute;
	return datetime;
}

/**
 * 获取时间格式为yyyy/MM/dd
 * @return 格式化后的时间字符串
 */
function getYMDTime(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var datetime = year+"/"+month+"/"+day;
	return datetime;
}

/**
 * 获取当天后的n天，时间格式为yyyy-MM-dd
 * @param days 天数
 * @return 格式化后的时间字符串
 */
function getYMDTimeOther(days){
	var date = new Date();
	date.setDate(date.getDate()+days);
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	if(day<10){
		day = "0"+day;
	}
	 hour = date.getHours(); //小时         
     minutes = date.getMinutes(); //分 
     if(minutes<10){
    	 minutes = "0"+minutes;
 	}
     seconds = date.getSeconds(); //秒  
     if(seconds<10){
    	 seconds = "0"+seconds;
 	}
	var datetime = year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds+"";
	return datetime;
}

/**
 * 求两个时间之差
 * @param date1 时间1
 * @param date2 时间2
 * @return 时间差
 */
function dateDiff(date1,date2){
	var type1 = typeof date1, type2 = typeof date2;
    if (type1 == 'string')
        date1 = stringToTime(date1);
    else if (date1.getTime)
        date1 = date1.getTime();
    if (type2 == 'string')
        date2 = stringToTime(date2);
    else if (date2.getTime)
        date2 = date2.getTime();
    return (date1 - date2) / (1000 * 60 * 60*24);
}

/**
 * 将时间字符串转换成时间
 * @param string 时间字符串
 * @return 时间
 */
function stringToTime(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
    parseInt(d[0], 10) || null,
    (parseInt(d[1], 10) || 1) - 1,
    parseInt(d[2], 10) || null,
    parseInt(t[0], 10) || null,
    parseInt(t[1], 10) || null,
    parseInt(t[2], 10) || null
    ));
}

/**
 * 根据时间毫秒数计算时间
 * @param date 时间字符串
 * @param million  毫秒值
 * @param flag 是否带时分秒
 * @return 时间字符串
 */
function getTimeByMillion(date,million,flag){
	var datetime = new Date();
	datetime = stringToTime(date);
	var milliontime = datetime.getTime();
	datetime.setTime(million+milliontime);
	var year = datetime.getFullYear();
	var month = datetime.getMonth()+1;
	if(month<10){
		month = "0" + month;
	}
	var day = datetime.getDate();
	if(day<10){
		day = "0" + day;
	}
	var hour = datetime.getHours();
	if(hour<10){
		hour = "0"+hour;
	}
	var minute = datetime.getMinutes();
	if(minute<10){
		minute = "0"+minute;
	}
	var yymmdd = year+"-"+month+"-"+day;
	var hhmm = hour+":"+minute; 
	if(flag == "hour"){
		return yymmdd+" "+hhmm;
	}else{
		return yymmdd;
	}
}

/**
 * highchart简单封装
 * @param ele 存放highchart的容器id
 * @param setting 配置
 * @param options 选项
 * @return highchart图表
 */
function initHighChart(ele,setting,options){
	var defaultOptions = {
		colors:['#F7A35C', '#95CEFF','#CCFFCC','#90ED7D','#CCCC66','#00CC00', '#CCFF99', '#CCCC33'],
		chart: {
            type: null
        },
        title: {
            text: null
        },
        xAxis: {
        	title: {
        		text: null
        	},
            categories: null
        },
        yAxis: {
            title: {
                text: null
            }
        },
        tooltip: {
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        credits: {
        	enabled: false
        },
        series: null
	};
	var defaultSetting = {
		type   : null,
		title  : null,
		xtitle : null,
		ytitle : null,
		xcategories : null,
		series : null
	};
	defaultOptions = $.extend(defaultOptions,options || {});
	defaultSetting = $.extend(defaultSetting,setting || {});
	if(defaultSetting.type != null){
		defaultOptions.chart.type = defaultSetting.type;
	}
	if(defaultSetting.title != null){
		defaultOptions.title.text = defaultSetting.title;
	}
	if(defaultSetting.ytitle != null){
		defaultOptions.yAxis.title.text = defaultSetting.ytitle;
	}
	if(defaultSetting.xcategories !=null){
		defaultOptions.xAxis.categories = defaultSetting.xcategories;
	}
	if(defaultSetting.series != null){
		defaultOptions.series = defaultSetting.series;
	}
	ele.highcharts(defaultOptions);
}

/**
 * 判断是否为null获取undefined
 * @param object 判断数据
 * @return Boolean
 */
function isNull(object){
	return object === null || object == undefined;
}

function isEmpty(object){
	if(isNull(object)){
		return true;
	}
	return object =="";
}
/**
 * 固定标题头信息，pos为要传过来的标题头信息
 * @param pos 位置
 * @param msg 信息
 */
function doPageHeader(pos,msg){
   $(".breadcrumbs").find(".pageheader").remove();
   if(isNull(msg)){
       $(".breadcrumbs").append("<div class='pageheader'><h3><a href='javascript:void(0);' onclick='doReturn()' title='"+$.i18n.prop('basic.opt.back')
	       +"'>&nbsp;&nbsp;&nbsp;<i class='glyphicon glyphicon-chevron-left opt-a-btn opt-btn-info'></i></a>"+pos.substring(pos.length-5,pos.length-2)
	       +$.i18n.prop('basic.hint.info')+ "</h3><div class='breadcrumb-wrapper'></a></div></div>");
   }else{
       $(".breadcrumbs").append("<div class='pageheader'><h3><a href='javascript:void(0);' onclick='doReturn()' title='"+$.i18n.prop('basic.opt.back')
	       +"'>&nbsp;&nbsp;&nbsp;<i class='glyphicon glyphicon-chevron-left opt-a-btn opt-btn-info'></i></a>"+pos.substring(pos.length-5,pos.length-2)
	       +$.i18n.prop('basic.hint.info')+ msg+"</h3><div class='breadcrumb-wrapper'></a></div></div>");
   }
  
}

/**
 * 给文本框赋值,并改变浏览文件按钮变成导入按钮
 * 必须指定toUpload方法
 * @param value 改变后按钮的值
 */
function upFileValue(value) {
    var upFileValue = $("#upFile").val();
    $("#textUpFile").val(upFileValue);
    $("#browseFile").remove();
    var isIE = isIeBrowser();
    if(isIE){
	$("#btnFile").append("<button class='grid_button default_blue' onclick='toUpload();return false;'style='margin-left: 150px; position: absolute; " +
		"height: 25px; border: none'><i class='glyphicon glyphicon-upload'></i>&nbsp;"+value+"</button>");
    }else{
	$("#btnFile").append("<button class='grid_button default_blue' onclick='toUpload();return false;'style='margin-right: 10px; position: absolute; " +
		"height: 25px; border: none'><i class='glyphicon glyphicon-upload'></i>&nbsp;"+value+"</button>");
    }
    
}

/**
 * 点击浏览文件，打开文件选择框,模拟点击
 */
function upFileValue2() {
    	document.getElementById('upFile').click();
}

/**
 * IE浏览器下上传文件的样式
 */
function uploadFilebyIE(){
    $("#btnFile").append("<input type='file' id='upFile' name='upFile' style='position: absolute;width: 150px;' onchange=\"upFileValue('"+$.i18n.prop('basic.opt.up')+"');\"/>" +
    	"<button class='grid_button default_blue' id='browseFile' style='margin-left: 150px; position: absolute; height: 25px; border: none' onclick='upFileValue2();'>" +
    	"<i class='glyphicon glyphicon-folder-open'></i>&nbsp;"+ $.i18n.prop('basic.opt.browfile')+ "</button>");
    $("#btnFile").css("margin-bottom","20px");
}

/**
 * 其他浏览器下上传文件的样式
 */
function uploadFilebyOther(){
    $("#btnFile").append("<input type=\"file\" class=\"file-uploader\" id=\"upFile\" name=\"upFile\" style=\"position: absolute;width: 150px;\" " +
    	"onchange=\"upFileValue('"+$.i18n.prop('basic.opt.up')+"');\"/>" +
    	"<input type=\"text\" class=\"form-control\" id=\"textUpFile\" style=\"border: none;height: 25px;background: white;\" disabled=\"disabled\"/>" +
    	"<button class=\"grid_button default_blue\" id=\"browseFile\"" +
    	"style=\"margin-right: 10px; position: absolute; height: 25px; border: none\" onclick=\"upFileValue2();\">" +
    	"<i class=\"glyphicon glyphicon-folder-open\"></i>&nbsp;"+$.i18n.prop('basic.opt.browfile')+"</button>");
}

/**
 * 判断浏览器是不是IE
 */
function isIeBrowser() {
    var isIE = false;
    //IE 7.8.9 直接下载
    var explorer = window.navigator.userAgent ;
    if (explorer.indexOf("MSIE") >= 0) {
        var b_name = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        var trim_version = version[1].replace(/[ ]/g, "");
        if (b_name == "Microsoft Internet Explorer") {
            /*如果是IE6、IE7、IE8、IE9 就直接下载帮助文档*/
            if (trim_version == "MSIE7.0" || trim_version == "MSIE6.0"
        	|| trim_version == "MSIE8.0" || trim_version == "MSIE9.0") {
        	isIE = true;
            }else{
        	isIE = false;
            }
        }
    }else{
	isIE = false;
    }
    return isIE;
}


/**
 * 显示提示进度条
 * @param objName 显示进度条的容器id
 */
function showProcessInfo(objName){
	if(isNull(objName)){
		$("body").waiting();
	}else{
		$("#"+objName).waiting();
	}
}

/**
 * 隐藏提示进度条
 * @param objName 进度条的容器id
 */
function hideProcessInfo(objName){
	if(isNull(objName)){
		$("body").waiting("hide");
	}else{
		$("#"+objName).waiting("hide");
	}
}

/**
 * 页面自适应方法
 */
function selfSuit() {
	//定义页面的最小宽度
//	var minWidth = 1340;
//	//对应div,如果不设置宽度，div会默认占据一整行，获取最外层main-container的宽度
//	//var windowW = $(".main-container").outerWidth();
//	//var windowH = $(".main-container").outerHeight();
//	var win = pageSize();
//	//是否窄屏
//	var isNarrow=$("#ace-settings-add-container2").is(':checked');
//	//前面宽度减去400是为了适应窄屏模式，后面减去20是当左侧菜单长度超过页面高度时不会产生横向滚动条	 
//	var windowW = isNarrow == true ? (parseInt(win.WinW)-400) : (parseInt(win.WinW));
//	var windowH = win.WinH;
//	//如果页面宽度小于最小宽度则，
//	if(!isNarrow && parseInt(windowW) < parseInt(minWidth)){
//	    windowW = minWidth;
//	}
//	//调整宽度
//	//设置头部logo的宽度
//	$(".navbar-inner").width(parseInt(windowW)-2);
//	//左侧导航条宽度
//	var sideBarW = $("#sidebar").outerWidth();
//	//设置右侧main-content的宽度
//	//这里减1，因为左侧导航栏的宽度默认为189px,而main-content的margin-left为190px，刚好多了1px，所有这里要减去1px
//	$("#main-content").width(parseInt(windowW)-parseInt(sideBarW)-2);
//	//调整layout的宽度，获取layout的宽度
//	var layoutW = $("#layout").outerWidth();
//	//获取左侧设备树的宽度
//	var layoutLeftW = $("#layout .layout-panel-west").outerWidth();
//	var expandWestDis = $("#layout .layout-expand-west").css("display");
//	if(expandWestDis != "none" && expandWestDis != undefined){
//		layoutLeftW = $("#layout .layout-expand-west").outerWidth();
//	}
//	//设备右侧数据列表的宽度
//	$("#layout .layout-panel-center").width(parseInt(layoutW)-parseInt(layoutLeftW));
//	//设置数据列表的头部,这里减去22，因为panel-header的width默认会比layout-panel-center的宽度大22px,所有要减去22px
//	$(".layout-panel-center .panel-header").width(parseInt(layoutW)-parseInt(layoutLeftW)-22);
//	//设置dataInfo的宽度
//	$("#dataInfo").width(parseInt(layoutW)-parseInt(layoutLeftW)-2);
//	//带设备树的jqGrid宽度调整
//	$("#listGrid1").jqGrid('setGridWidth', parseInt(layoutW)-parseInt(layoutLeftW)-10);
//	//设置不带树的jqGrid宽度
//	$("#listGrid").jqGrid('setGridWidth', parseInt(windowW)-parseInt(sideBarW)-4);
//	$("#listGrid").width(parseInt(windowW)-parseInt(sideBarW)-26);
//	//调整高度
//	//获取body的高度
//	var windowH = $("body").outerHeight();
//	//获取logo的高度
//	var logoH = $(".navbar-inner").outerHeight();
//	//获取面包屑的高度
//	var breadcrumbsH = $("#breadcrumbs").outerHeight();
//	//获取panel-header的高度
//	var panelHeaderH = $("#layout .panel-header").outerHeight();
//	$("#gbox_listGrid .ui-jqgrid-bdiv").css("height",parseInt(windowH)-parseInt(logoH)-180);
//	$("#gbox_listGrid1 .ui-jqgrid-bdiv").css("height",windowH-parseInt(logoH)-parseInt(breadcrumbsH)-150);
//	$("#dataInfo").css({'overflow-x':'hidden'});
//	$(".ui-jqgrid-hdiv").css({ "overflow-x" : "hidden" });
//	$("#treeLeft,#dataInfo,#layout .panel-body").height(windowH-parseInt(logoH)-parseInt(breadcrumbsH)-46);
//	$("#layout,#layout .layout-panel-center,.layout-expand-west").height(windowH-parseInt(logoH)-parseInt(breadcrumbsH)-7);
};

/**
 * 折叠左侧设备树的时候，调整右侧内容的宽度
 * @param ele 调整对象id
 * @param width 宽度值
 */
function setLeftGridWidth(ele,width){
	//调整layout的宽度，获取layout的宽度
	var layoutW = $("#layout").outerWidth();
	var layoutLeftW = $("#layout .layout-expand-west").outerWidth();
	if($("#layout .layout-expand-west").css("display") == "none"){
		layoutLeftW = 28;
	}
	//设备右侧数据列表的宽度
	$("#layout .layout-panel-center").width(parseInt(layoutW)-parseInt(layoutLeftW));
	//设置数据列表的头部,这里减去22，因为panel-header的width默认会比layout-panel-center的宽度大22px,所有要减去22px
	$(".layout-panel-center .panel-header").width(parseInt(layoutW)-parseInt(layoutLeftW)-22);
	//设置dataInfo的宽度
	$("#dataInfo").width(parseInt(layoutW)-parseInt(layoutLeftW)-2);
	var layoutH = $("#layout").outerHeight();
	var panelHeaderH = $(".layout-panel-center .panel-header").outerHeight();
	$("#layout .layout-panel-center").height(parseInt(layoutH));
	$(".layout-expand-west").height(parseInt(layoutH));
	$("#dataInfo,#layout .panel-body").height(parseInt(layoutH)-parseInt(panelHeaderH)-1);
}

/**
 * 展开左侧设备树的时候，调整右侧内容的宽度
 * @param ele 调整的对象id
 * @param width 宽度值
 */
function setRightGridWidth(ele,width){
	//调整layout的宽度，获取layout的宽度
	var layoutW = $("#layout").outerWidth();
	var expandWestW = $("#layout .layout-panel-west").outerWidth();
	$("#listGrid1").jqGrid('setGridWidth', parseInt(layoutW)-parseInt(expandWestW)-10);
}
/**
 * 键入enter键，进行查询
 * @param e 键盘响应
 * @return
 */
function queryEnterPress(e){
    var e=e||window.event;
    if (e.keyCode == 13) {
    	jQuery('#queryBtn').trigger('click');
    }
}

/**
 * 键入enter键，进行查询
 * @param e 键盘响应
 * @return
 */
function treeQueryEnterPress(e){
    var e=e||window.event;
    if (e.keyCode == 13) {
    	jQuery('#treeSearchBtn').trigger('click');
    }
}

/**
 * 键入enter键，进行保存
 * @param e 键盘响应
 * @return
 */
function formEnterPress(e){
    var e=e||window.event;
    if (e.keyCode == 13) {
    	jQuery('#confirmBtn').trigger('click');
    }
}

/**
 * 新增的名称与现有的不重复
 * 前端校验
 * @param name 输入的名称值
 * @return
 */
function VerifyName(nName){
	 var ids = jQuery("#listGrid").jqGrid('getDataIDs');
     for (var i = 0; i < ids.length; i++) {
         var id = ids[i];
         //根据id获取行数据,返回的是列表
         var rowDatas = $("#listGrid").jqGrid('getRowData', id);
         //取到选中行某一字段的值，其中name为colModel中定义的字段名
         var name = rowDatas["name"];
         if(name==nName){
        	 return false;
         } 
     }
     return true;
}

/**
 * 验证输入日期是否合法
 * @author qinyeji
 * @param start 开始时间 ：选择器对象
 * @param end 结束时间：选择器对象
 * @param type 时间类型 start or end
 */
function verificationTime(start,end) {
    var startTime = start.val();
    var endTime = end.val();
    //粗略转换时间字符串为天数
    var sArray = startTime.split("-");
    var start2Day = sArray[0] + sArray[1] + sArray[2];    
    var eArray = endTime.split("-");
    var end2Day = eArray[0] + eArray[1] + eArray[2];
    //获取当前时间转换为字符串天数
    var d = new Date();
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate();
    if (vMon < 10) {
	vMon = "0" + vMon;
    }
    if (vDay < 10) {
	vDay = "0" + vDay;
    }
    var currentTime = vYear + "" + vMon + "" + vDay;
    
    var startSpace = currentTime - parseInt(start2Day);
    var endSpace = currentTime - parseInt(end2Day);
    
    if (startTime!=null && startTime!="" && startSpace < 0) {
	showInfoMsg($.i18n.prop('basic.hint.starttime'));
	start.val("");
    }
    if (endTime!=null && endTime!="" && endSpace < 0) {
	showInfoMsg($.i18n.prop('basic.hint.thattime'));
	end.val("");
    }
    var space = parseInt(end2Day) - parseInt(start2Day);
    if (space < 0) {
	showInfoMsg($.i18n.prop('basic.hint.endtime'));
	return;
    }        
}

/**
 * 切换窄屏模式
 */
function narrow(){
    var checkBox2=$("#ace-settings-add-container2").is(':checked');
    if(checkBox2){
	$("#main-container").addClass("container2");
	$("#sidebar").css("margin-left","190px");
	$(".main-content").css("margin-left","380px");
	$(".main-content").width($("body").width() - $("#sidebar").outerWidth()-400);
	$("#mainContent").width($("body").width() - $("#sidebar").outerWidth()-400);
	$(".margin-contain").width($("body").width() - $("#sidebar").outerWidth()-400);
	$(".container").width($("body").width() - $("#sidebar").outerWidth()-400);
	selfSuit();
    }else{
	$("#main-container").removeClass("container2");
	$("#sidebar").css("margin-left","0px");
	$(".main-content").css("margin-left","190px");
	$(".main-content").width($("body").width() - $("#sidebar").outerWidth()-5);
	$("#mainContent").width($("body").width() - $("#sidebar").outerWidth()-5);
	$(".margin-contain").width($("body").width() - $("#sidebar").outerWidth()-5);
	$(".container").width($("body").width() - $("#sidebar").outerWidth()-35);
	selfSuit();
    }
}

/**
 * 配置模板中默认值的设置，或者一些特殊的配置
 * 
 * @param devModel 设备类型
 * @param confItem 配置项
 * @param confField 配置字段
 * @return
 */
function intercalateDefVal(devModel, confItem, confField){
	if(devModel == null){
		//定位服务配置特殊设置，如果"定位信道扫描开关"开启后，"定位扫描信道列表"允许编辑，反之，则"定位扫描信道列表"不允许编辑
		if(confItem == "locatorServer"){
			if(confField == "locator_channel_sw"){
				var locatorChannelSw = $("#locator_channel_sw").val();
		  		if(locatorChannelSw == '0'){
					$("#locator_channel").attr("disabled","disabled");
				}else{
					$("#locator_channel").removeAttr("disabled");
				}
			}
		}
	}else if(devModel == "CGW500"||devModel == "DW-CGW500"||devModel == "CGW500U"||devModel == "CGW350-T"||devModel == "CGW350-FT"||devModel == "TA2020C"){
		if(confItem == "ssidBasic"){
			if(confField == "vap_{index}_wifi_id"){
				$("#vap_\\{index\\}_wifi_id option[value='1']").remove();
			}
		}
	}else{
		
	}

	$(".audit_factory_option").addClass("displayClass");
	if(devModel=="CGW500"){
	 	$("#audit_factory_1").removeAttr("selected");
		$("#audit_factory_2,#audit_factory_6").removeClass("displayClass");
		$("#audit_factory_2").attr("selected","selected");
	}
	if(devModel=="CGW600"||devModel=="CGW800"||devModel=="CGW4000"||devModel=="CGW800i"||devModel=="CGW600A"){
		$("#audit_factory_1,#audit_factory_3,#audit_factory_5,#audit_factory_6,#audit_factory_7,#audit_factory_8")
		.removeClass("displayClass");
	}
	if(devModel=="CGW1200"){
		$("#audit_factory_1,#audit_factory_2,#audit_factory_4,#audit_factory_8")
		.removeClass("displayClass");  				
	}
	if(devModel=="CGW2000"){
		$("#audit_factory_1,#audit_factory_2,#audit_factory_3,#audit_factory_4,#audit_factory_5,#audit_factory_6,#audit_factory_7,#audit_factory_8").
		removeClass("displayClass");
	}
	if($("#audit_server_enable").val()==0){
		$(".trClass").addClass("displayClass");
		$("#tr_audit_server_enable").removeClass("displayClass");
	}else if($("#audit_server_enable").val()==1){
		$(".trClass").addClass("displayClass");
		$("#tr_audit_server_enable,#tr_audit_factory").removeClass("displayClass");
		if($("#audit_factory").val()==1){
			$("#tr_audit_server_addr,#tr_audit_network_name,#tr_audit_network_addr,#tr_audit_ap_longitude")
			.removeClass("displayClass");
			$("#tr_audit_ap_latitude,#tr_audit_dataUpSwitch,#tr_audit_staCollectionSwitch,#tr_audit_mirrorUpSwitch")
			.removeClass("displayClass");
			$("#tr_audit_mirrorUpProtocol,#tr_audit_dev_addr,#tr_audit_deviceType,#tr_audit_analogMacSwitch")
			.removeClass("displayClass");
		}
		if($("#audit_factory").val()==2){
			$("#tr_audit_server_addr").removeClass("displayClass");
		}
		if($("#audit_factory").val()==3){
			$("#tr_audit_scan_server").removeClass("displayClass");
			if(devModel=="CGW600"||devModel=="CGW800"||devModel=="CGW4000"||devModel=="CGW800i"||devModel=="CGW600A"){
				$("#tr_audit_scan_type,#tr_audit_scan_channel")
				.removeClass("displayClass");
			}
		}
		if($("#audit_factory").val()==4){
			$("#tr_audit_server_addr,#tr_audit_network_name,#tr_audit_net_interface")
			.removeClass("displayClass");
		}
		if($("#audit_factory").val()==5){
			$("#tr_audit_firmcode,#tr_audit_server_addr,#tr_audit_network_name,#tr_audit_network_code")
			.removeClass("displayClass");
			$("#tr_audit_network_addr,#tr_audit_ap_longitude,#tr_audit_ap_latitude,#tr_audit_net_interface")
			.removeClass("displayClass");
			$("#tr_audit_site_type,#tr_audit_site_nature").removeClass("displayClass");
		}
		if($("#audit_factory").val()==6){
			$("#tr_audit_firmcode,#tr_audit_server_addr,#tr_audit_network_name")
			.removeClass("displayClass");						
			$("#tr_audit_network_code,#tr_audit_network_addr,#tr_audit_ap_longitude")
			.removeClass("displayClass");
			$("#tr_audit_ap_latitude,#tr_audit_site_type,#tr_audit_site_nature")
			.removeClass("displayClass");
			$("#tr_audit_dev_addr,#tr_audit_upload_interval")
			.removeClass("displayClass");
			if(devModel=="CGW600"||devModel=="CGW800"||devModel=="CGW4000"||devModel=="CGW800i"||devModel=="CGW600A"){
				$("#tr_audit_deviceType_ra")
				.removeClass("displayClass");
			}
		}
		if($("#audit_factory").val()==7){
			$("#tr_audit_scan_server").removeClass("displayClass");
			if(devModel=="CGW600"||devModel=="CGW800"||devModel=="CGW4000"||devModel=="CGW800i"||devModel=="CGW600A"){
				$("#tr_audit_scan_type").removeClass("displayClass");
				$("#tr_audit_scan_channel").removeClass("displayClass");
			}
		}
		if($("#audit_factory").val()==8){
			$("#tr_audit_server_addr,#tr_audit_network_name,#tr_audit_network_code,#tr_audit_dev_addr").removeClass("displayClass");
			$("#audit_dev_addr").removeClass("displayClass");
		}
	}
}

function openInputWindow(windowId, alertTitle, content, okCallBack, validate, closeCallBack) {
    if (windowId == null) {
        windowId = openInputWindowId;
    }
    if ($('#' + windowId).length <= 0) {
        $(".main-content").append(
        	//id=\"myModalId\"
        	"<div class=\"modal fade\" id=\"" + windowId + "\"  role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n"+
                "    <div class=\"modal-dialog\" >\n"+
                "        <div class=\"modal-content\" style=\"margin:10px;\" >\n"+
                "            <div id=\"modal-header\" class=\"modal-header alert-info\">\n"+
                "                <button type=\"button\" class=\"close\">&times;</button>\n"+
                "                <h4 class=\"modal-title\" id=\"myModalLabel\"></h4>\n"+
                "            </div>\n"+
                "            <div class=\"modal-body alert_info\" style='padding: 0'>\n"+
                "            </div>\n"+
                "            <div class=\"modal-footer\" style='margin-top: 2px;'>\n"+
                "					<button class=\"btn btn-primary closeBtn\"><i class='glyphicon glyphicon-remove'></i>关闭</button>"+
                "					<button class=\"btn btn-primary okBtn\"><i class='glyphicon glyphicon-ok'></i>确定</button>"+
                "            </div>\n"+
                "        </div>\n"+
                "    </div>\n"+
                "</div>"
        );
    } 

    if (alertTitle == null) {
        alertTitle = msgDefaultTitle;
    }
    $("#" + windowId + " #myModalLabel").html(alertTitle);

    if ($('#'+windowId +" .modal-body").html().length != 0) {
        $('#'+windowId +" .modal-body").empty();
    }
    if(content){
    	$('#'+windowId +" .modal-body").html(content);
    }
    $("#" + windowId).modal({
        keyboard: true,				// 设置为true,表示当点击Esc键时模态消失
        backdrop: 'static'			// backdrop类型为Boolean和String;设置backdrop(背景消失/遮盖层消失)为false或者'static'都可以做到，当点击遮盖层时模态不消失
    });
    if(okCallBack){
    	var obj = $("#"+windowId +" .modal-body");
    	//防止绑定多个事件，导致事件执行多次
    	$("#"+windowId +" .okBtn").unbind("click");
    	$("#"+windowId +" .okBtn").bind("click", function(event){
    		okCallBack.call(this, obj, event);
    	})
    }
    if(validate){
    	validate();
    }
    if(closeCallBack){
    	var obj = $("#"+windowId +" .modal-body");
    	//防止绑定多个事件，导致事件执行多次
    	$("#"+windowId +" .closeBtn").unbind("click");
    	$("#"+windowId +" .closeBtn").bind("click", function(event){
    		closeCallBack.call(this, obj, event);
    	})
    	$("#"+windowId + " .close").unbind("click");
    	$("#"+windowId + " .close").bind("click", function(event){
    		closeCallBack.call(this, obj, event);
    	});
    }else{
    	var obj = $("#"+windowId +" .modal-body");
    	//防止绑定多个事件，导致事件执行多次
    	$("#"+windowId +" .closeBtn").unbind("click");
    	$("#"+windowId +" .closeBtn").bind("click", function(event){
    		closeWindow("openInputWindowId");
    	});
    	$("#"+windowId + " .close").unbind("click");
    	$("#"+windowId + " .close").bind("click", function(event){
    		closeWindow("openInputWindowId");
    	});
    }
    return false;
}

//验证配置模板中特殊情况
function validateConfigTpl(){
	var portMode = $("#vap_\\{index\\}_port_mode").val();
	if(portMode == 0){
		var inputValue = $("#vap_\\{index\\}_vlan_list").val();
		if(inputValue.indexOf(",") != -1){
			showWarningMsg("VLAN列表，在ACCESS模式下只能有一个！");
			return false;
		}
	}	
	return true;
}

