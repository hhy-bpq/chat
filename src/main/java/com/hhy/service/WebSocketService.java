package com.hhy.service;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hhy.common.ConParam;
import com.hhy.common.MsgData;
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
	
	private static final Logger LOG =  LoggerFactory.getLogger(WebSocketService.class);
	
	public WebSocketService(){
		super(new InetSocketAddress(7897));//参数是 websocket服务的端口号
		MsgData msg=new MsgData();
		msg.setType(ConParam.ERROR);
		errorData=msg.toJson();
		this.start();
	}

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
