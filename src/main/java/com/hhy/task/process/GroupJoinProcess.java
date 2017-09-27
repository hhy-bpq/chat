package com.hhy.task.process;

import java.util.List;

import org.java_websocket.WebSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.hhy.common.ConParam;
import com.hhy.common.MsgData;
import com.hhy.manager.UserSocketManager;
import com.hhy.manager.WebSocketTokenManager;
/**
 * 组聊天信息
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
@Service
public class GroupJoinProcess implements TaskProcess{
	private static final Logger LOG =  LoggerFactory.getLogger(GroupJoinProcess.class);
	@Autowired
	private UserSocketManager socketManager;

	@Override
	public void execute(MsgData msg,WebSocket socket) {
		if(check(msg,socket)) {
			LOG.info("token 校验成功");
			socketManager.add(socket, msg);//添加到用户缓存中
			String room=msg.getRoom();
			if(!StringUtils.isEmpty(room)) {
				List<WebSocket> list=socketManager.getSocketByRoom(room);
				for(WebSocket webSocket:list) {
					webSocket.send(msg.toJson());
				}
			}
		}else {
			LOG.info("token 校验失败\twebsocket close");
			socket.close();
		}
	}

	@Override
	public boolean check(MsgData msg, WebSocket socket) {
		String user=msg.getUser();
		String token=msg.getMsg();
		return WebSocketTokenManager.getInstance().check(user, token);
	}

}
