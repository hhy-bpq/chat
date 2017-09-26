<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html >

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    

    <title>登录</title>
    <link rel="shortcut icon" href="favicon.ico"> 
    
    <link href="../css/bootstrap.3.0.min.css" rel="stylesheet">
    <link href="../css/style1.css" rel="stylesheet">
	<script src="../js/jquery-1.11.0.min.js"></script>
	<script src="../js/bootstrap.3.0.min.js"></script>
</head>

<body class="gray-bg">

    <div class="middle-box text-center loginscreen  animated fadeInDown">
        <div>
            <div>

                <h1 class="logo-name" style="font-size:130px;">Chat</h1>

            </div>
            <h3>欢迎</h3>

           <form class="m-t" action="/login" method="post">
                <div class="form-group">
                    <input type="txt" class="form-control" name="username"placeholder="用户名" required="">
                </div>
                <div class="form-group">
                    <input type="password"   name="password"class="form-control" placeholder="密码" required="">
                </div>
                <button type="submit" class="btn btn-primary block full-width m-b">登录</button>
                <p class="text-muted text-center"> <a href="#"><small>忘记密码了？</small></a> | <a href="">注册一个新账号</a>
                </p>

            </form>
        </div>
    </div>
</body>

</html>