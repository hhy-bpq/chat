var wsUri='ws://'+window.location.hostname+':7897';//创建的websocket连接路径，
var websocket;
var websockethashCode;
var showId='receiveMsg';
var isShow=true; //vi状态下 按down键才把接收到的消息显示显示
var telnetHashcode;
//判断浏览器版本，ie低版本引入flash，模拟websocket
var WEB_SOCKET_SWF_LOCATION ;
(function() {
	var explorer = window.navigator.userAgent ;
	if (explorer.indexOf("MSIE") >= 0) {
		var b_name = navigator.appName;
		var b_version = navigator.appVersion;
		var version = b_version.split(";");
		var trim_version = version[1].replace(/[ ]/g, "");
		if (b_name == "Microsoft Internet Explorer") {

			/*如果是IE6 7 8 9*/

			if (trim_version == "MSIE7.0" || trim_version == "MSIE6.0"
				|| trim_version == "MSIE8.0"
					|| trim_version == "MSIE9.0") {
				document.write("<script src='./js/swfobject.js' type='text/javascript'></script>");
				document.write("<script src='./js/web_socket.js' type='text/javascript'></script>");
				WEB_SOCKET_SWF_LOCATION ="./js/WebSocketMain.swf";
			}
		}
	}
})();
/**
 * websocket连接 开启，处理函数
 */
function webSocketInit(){
	if(websocket!=null){
		websocket.close();
		websocket=null;
	}
	websocket= new WebSocket(wsUri);//ws://localhost:7897 在页面输密码之前
	//建立连接时触发
	websocket.onopen=function(evt){//接收到的数据
		console.log("open");
	}
	//接收到后台数据时触发
	websocket.onmessage=function(evt){
		console.log(evt.data);
		//用来判断是否是telnet数据，telnet数据比较特殊，
		//无法用json格式存，所有的telnet数据都以telnet:开头
//		if(evt.data.indexOf("telnet:")==0){
//			telnetMsg(evt.data);
//			return;
//		}
//		var json = eval('(' + evt.data + ')');
//		//用来判断是否是为了方便telnet建立连接时，所需要的影藏字段
//		if(json.socusType=="link"){
//			telLinkMsg(json);
//			return;
//		}
//		//用来判断是否是加密狗数据
//		if(json.socusType=="Dog"){
//			dogMsg(json);
//	    	return;
//		}
	}
	//发送错误时，触发
	websocket.onerror=function(evt){
		
	}
	//关闭连接时触发
	websocket.onclose=function(evt){
		
	}
}
$("#btn").click(function(){
	websocket.send($("#msg").val());
});
///**
// * 在开启websocket时调用这函数
// * @param evt
// * @return
// */
//function onOpen(evt){
//
//}
///**
// * 接收到的数据，调用此函数，将其显示在页面
// * @param msg
// * @return
// */
//function onMessage(msg){
//	if(!isShow&&showId=="show-tel-vi"){
//		return;
//	}
//	var message=$("#"+showId).val()+msg;
//	$("#"+showId).val(message);
//	var textarea=$("#"+showId);
//	//$("#"+showId).scrollTop(textarea[0].scrollHeight - textarea.height());
//	$("#"+showId).scrollTop($("#"+showId).scrollTop()+document.getElementById(showId).scrollHeight);
//	//已显示过内容，全部滚动到显示内容上面，低版本ie 无法保证， 一定显示在在滚动条最低部，但是可以保证显示的都是新内容
//	//scrollTop() 表示已经被滚动条滚上去的部分  
//	//scrollHeight  火狐 谷歌 高版本ie 表示滚动条可滚动高度  低版本ie表示，元素和模型的总高度
//}
////发送信息到telnet
//function doSend(){
//	var message= $("#sendMsg").val();
//	websocket.send("telnet:"+message);
//}
//function Disconnect(){
//
//}
//function windowClear(){
//	$("#receiveMsg").val("");
//}
////处理telnet数据，以telnet:开头的String字符串
//function telnetMsg(data){
//	var telMsg=data.replace("telnet:","");
//	if("closed"==telMsg){
//		closeWindow("Telnet");
//		return;
//	}
//	onMessage(telMsg);
//}
////处理telnet需要的影藏字段,json格式，
//function telLinkMsg(json){
//	websockethashCode=json.msg;
//	if(websockethashCode!=""||websockethashCode!=null){
//		$("#hashCode").val(json.msg);
//		telnetHashcode=json.msg;
//	}
//}
////用来处理加密狗数据，json格式， 
//function dogMsg(json){
//	if(json.msgType=="info"&&json.msg!="success"){
//		showConfigMsg("$.i18n.prop('websocket.hint.dogservice.message')："+json.msg,function(r){
//            if(r){
//                location.href =loginOutUrl;
//            }
//         });
//    }else if(json.msgType=="error"){
//    	function errorMsg() {
//        	showErrorMsg("$.i18n.prop('websocket.hint.dogservice.error')："+json.msg);
//        	location.href = loginOutUrl;
//        }
//    	errorMsg();
//    }
//}