package com.hhy.service;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.hhy.bean.ConParam;
import com.hhy.bean.MsgData;
import com.hhy.manager.UserSocketManager;
import com.hhy.task.TaskManager;
/**
 * websocket 服务端
 * @author huanghaiyun
 * @createTime 2017年9月11日
 *
 */
@Service
public class WebSocketService extends WebSocketServer{
	
	@Autowired
	private TaskManager manager;
	private String errorData;
	
//	private static final WebSocketServices INSTANCE=new WebSocketServices(new InetSocketAddress(7897));//改成低版本协议，支持低版本火狐等
	private static final Logger LOG =  LoggerFactory.getLogger(WebSocketService.class);
	
	public WebSocketService(){
		super(new InetSocketAddress(7897));
		MsgData msg=new MsgData();
		msg.setType(ConParam.ERROR);
		errorData=msg.toJson();
		this.start();
	}
//	public static WebSocketServices getInstance(){
//		LOG.info("初始化成功");
//		return INSTANCE;
//	}

	@Override
	public void onClose(WebSocket webScoket, int arg1, String arg2, boolean arg3) {
		manager.executeMsg(errorData, webScoket);
		LOG.info("onClose:"+webScoket);
	}

	@Override
	public void onError(WebSocket webScoket, Exception e) {
		LOG.error("onError:",e);
		manager.executeMsg(errorData, webScoket);
		
	}

	@Override
	public void onMessage(WebSocket webScoket, String data) {
		LOG.info(webScoket+":\t"+data);
		manager.executeMsg(data, webScoket);
	}

	@Override
	public void onOpen(WebSocket webScoket, ClientHandshake arg1) {
		LOG.info("onOpen:"+webScoket);
	}
	
}
