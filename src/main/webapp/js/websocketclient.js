/**
 * websocket
 * @param options可以不写，有默认值、
 *     url:'ws://'+window.location.hostname+':7897',
 *   msgId:"msg",
 *    username:"test",
 *    showDiv:"msgDiv",//数据显示区域
 *    timeDiv:"msgTime",//更新时间区域
 *    pic:"../img/a1.jpg",//头像路径
 *    type:12,//组队聊天类型
 *    room:"all",//公共聊天室
 *    tarUser:"test",//所有人
 *    onopen:function(evt){
 *            console.log("open");
 *        },
 *    onmessage:function(evt){
 *          //默认处理
 *       },
 *   errorFun:function(evt){
 *           console.log(evt);
 *       },
 *   onclose:function(evt){
 *           console.log(evt);
 *       },
 *   send:function(msgId){
 *          defsendMsg();
 *   }
 *
 * @returns {{}}
 * @constructor
 */
var WebSocketClient=function(options){
    var defOpt={
        url:'ws://'+window.location.hostname+':7897',
        msgId:"msg",
        username:"test",
        showDiv:"msgDiv",
        timeDiv:"msgTime",
        pic:"../img/a1.jpg",
        type:21,//组队聊天类型
        room:"all",//公共聊天室
        tarUser:"test",//所有人
        onopen:function(evt){
            join();
        },
        onmessage:function(evt){
            defMsgProcess(evt);
        },
        errorFun:function(evt){
            console.log(evt);
        },
        onclose:function(evt){
            console.log(evt);
        },
        send:function(){
            defsendMsg();
        }
    };
    //融合配置项
    var opts = $.extend({}, defOpt, options);

    var me={};
    // var wsUri='ws://'+window.location.hostname+':7897';//创建的websocket连接路径，
    var websocket;

    /**
     * websocket连接 开启，处理函数
     */
    me.init=function(){
        if(websocket!=null){
            websocket.close();
            websocket=null;
        }
        websocket= new WebSocket(opts.url);//ws://localhost:7897 在页面输密码之前
        //建立连接时触发
        websocket.onopen=function(evt){//接收到的数据
            opts.onopen(evt);
        }
        //接收到后台数据时触发
        websocket.onmessage=function(evt){
            opts.onmessage(evt);
        }
        //发送错误时，触发
        websocket.onerror=function(evt){
            opts.errorFun(evt);
        }
        //关闭连接时触发
        websocket.onclose=function(evt){
            opts.onclose(evt);
        }
    }
    me.sendData=function (data) {
        websocket.send(data);
    }
    me.send=function () {
        opts.send(opts.msgId);
    }
    me.setOpt=function (key,val) {
        opts[key]=val;
    }
    me.init();

    /**
     * 默认的收到数据处理
     * @param evt
     */
    function defMsgProcess(evt) {
        var msg= eval('(' + evt.data+ ')');
        if(msg.type==21){//组聊天消息
            getChatMsg(msg);
        }else if(msg.type==20){//组内有人上线
            getGroupJoinMsg(msg);
        }
    }


    /**
     * 默认的发送数据格式
     */
    function defsendMsg(){
        if($("#"+opts.msgId).val()==""){
            return;
        }
        var msg=encodeURI($("#"+opts.msgId).val());
        var data="{\"user\":\""+opts.username+"\"," +
            "\"msg\":\""+msg+"\"," +
            "\"type\":" +opts.type+","+
            "\"room\":\""+opts.room+"\"," +
            "\"tarUser\":\""+opts.tarUser+"\"," +
            "\"pic\":\""+opts.pic+"\"," +
            "}";
        $("#"+opts.msgId).val("");
        websocket.send(data);
    }

    /**
     * 发送join 报文
     */
    function join(){
        var data="{\"user\":\""+opts.username+"\"," +
        "\"type\":" +parseInt(opts.type-1)+","+
        "\"room\":\""+opts.room+"\"," +
        "\"tarUser\":\""+opts.tarUser+"\"," +
        "\"pic\":\""+opts.pic+"\"," +
        "}";
        websocket.send(data);
    }
    /**
     * 收到他人上线的消息
     */
    function getGroupJoinMsg(data){
        var html="";
        $("#"+data.user).remove();
        html+="\t<div class=\"chat-user\" id=\""+data.user+"\">\n" +
            "\t    <span class=\"pull-right label label-primary\">在线</span>\n" +
            "\t    <img class=\"chat-avatar\" src=\""+data.pic+"\" alt=\"\">\n" +
            "\t    <div class=\"chat-user-name\">\n" +
            "\t        <a href=\"#\">"+data.user+"</a>\n" +
            "\t    </div>\n" +
            "\t</div>"
        $("#userList").append(html);
    }
    /**
     * 收到他人发送的消息
     */
    function getChatMsg(msg){
        var html="";
        if(msg.user==user){
            html+="<div class=\"chat-message chat-message-right \">\n";
        }else{
            html+="<div class=\"chat-message chat-message-left \">\n";
        }
        html+="\t                                    <img class=\"message-avatar\" src=\""+msg.pic+"\" alt=\"\">\n" +
            "\t                                    <div class=\"message\">\n" +
            "\t                                        <a class=\"message-author\" href=\"#\"> "+msg.user+"</a>\n" +
            "\t                                        <span class=\"message-date\"> "+msg.date+"</span>\n" +
            "\t                                        <span class=\"message-content\">" +decodeURI(msg.msg).replace(/\n/g,"</br>")+ "</span>\n" +
            "\t                                    </div>\n" +
            "\t                                </div>";
        $("#"+opts.showDiv).append(html);
        $("#"+opts.timeDiv).html("最新消息："+msg.date);
        $("#"+opts.showDiv).scrollTop($("#msgDiv").height());
    }
    return me;
}