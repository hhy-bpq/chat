<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script src="./js/jquery-1.11.0.min.js" type="text/javascript"></script>
<script src='./js/swfobject.js' type='text/javascript'></script>
<script src='./js/web_socket.js' type='text/javascript'></script>
</head>
<body>
<h1>hello</h1>
<textarea id="msg" type="text"></textarea><input type="button" id="btn" value="发送"/>
<script type="text/javascript">

var wsUri='ws://'+window.location.hostname+':7897';//创建的websocket连接路径，
var websocket;
var WEB_SOCKET_SWF_LOCATION="./js/WebSocketMain.swf" ;
(function() {
	webSocketInit();
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
		//$("body").append(evt.data);
		console.log(evt.data);
        var msg= eval('(' + evt.data+ ')');
        var myDate = (new Date()).toLocaleString( );
        $("body").append("<p class=\"userName\">"+msg.name+":"+myDate+"</P>");
        $("body").append("<p class=\"userName\">"+decodeURI(msg.msg).replace(/\n/g,"</br>")+"</P>");
        console.log(evt);
        $("body").append(evt.data);
	}
	//发送错误时，触发
	websocket.onerror=function(evt){
		
	}
	//关闭连接时触发
	websocket.onclose=function(evt){
		
	}
}
$("#btn").click(function(){
    var username="test";
    var msg=encodeURI($("#msg").val());
    var data="{\"name\":\""+username+"\",\"msg\":\""+msg+"\"}";
    $("#msg").val("");
	websocket.send(data);
});
</script>
</body>
</html>