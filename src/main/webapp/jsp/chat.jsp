<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
    <link href="../css/bootstrap.3.0.min.css" rel="stylesheet">
    <link href="../css/style1.css" rel="stylesheet">
	<script src="../js/jquery-1.11.0.min.js"></script>
	<script src="../js/bootstrap.3.0.min.js"></script>
	<script src="../js/websocketclient.js"></script>
    <style>
        body{
            overflow: hidden;
        }
        .commitBtn{
            position: absolute;
            bottom: 1px;
            right: 17px;
        }
        .group-info{
            height: 85px;
        }
        .group-info-st{
            margin: 5px auto;
            width: 100px;
        }
        .content-chat{
            width: 750px;
            margin: 60px auto;
        }
        .img-group{
        	width:50px;
        }
    </style>
</head>
<body class="gray-bg">
	<div class="wrapper wrapper-content content-chat">
	
	    <div class="row">
	        <div class="col-sm-12">
	
	            <div class="ibox chat-view">
	
	                <div class="ibox-title">
	                    <small class="pull-right text-muted" id="msgTime">最新消息：</small> 聊天窗口
	                </div>
	
	
	                <div class="ibox-content">
	
	                    <div class="row">
	
	                        <div class="col-md-9">
	                            <div class="chat-discussion" id="msgDiv">
	
	                            </div>
	
	                            <div class="chat-message-form">
	
	                                <div class="form-group">
	                                    <textarea id="msg" class="form-control message-input" name="message" placeholder="输入消息内容"></textarea>
	                                    <input type="button" id="commitMsg" class="commitBtn btn btn-primary" value="发送"/>
	                                </div>
	                            </div>
	                        </div>
	                        <div class="col-md-3">
	                            <div class="group-info">
	                                <div class=" group-info-st">
	                                    <span><img alt="image" class="img-circle img-group" src="img/a1.jpg"/></span>
	                                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
	                                        <span class="clear">
	                                            <span class="block m-t-xs"><strong class="font-bold">公共聊天室</strong></span>
	                                        </span>
	                                    </a>
	                                </div>
	                            </div>
	                            <div class="chat-users">
	                                <div class="users-list">
	                                    <div class="chat-user">
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">hhy</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">123</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <span class="pull-right label label-primary">在线</span>
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">456</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <span class="pull-right label label-primary">在线</span>
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">qwe	</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">xxx</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">qqqq</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">333</a>
	                                        </div>
	                                    </div>
	                                    <div class="chat-user">
	                                        <span class="pull-right label label-primary">在线</span>
	                                        <img class="chat-avatar" src="img/a1.jpg" alt="">
	                                        <div class="chat-user-name">
	                                            <a href="#">ddd</a>
	                                        </div>
	                                    </div>
	
	
	                                </div>
	
	                            </div>
	                        </div>
	
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
<script type="text/javascript">
    var user="${user}";
    var picUrl="${pic}";
    var opt={
        username:user,
        pic:picUrl,
    }
    var websocket=WebSocketClient(opt);
    $("#commitMsg").click(function(){
        websocket.send();
    });
    $(function () {
        
    })
</script>

</body>
</html>