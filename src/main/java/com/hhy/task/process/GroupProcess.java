package com.hhy.task.process;

import java.util.List;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hhy.common.MsgData;
import com.hhy.manager.UserSocketManager;
/**
 * 组聊天信息
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
@Service
public class GroupProcess implements TaskProcess{
	@Autowired
	private UserSocketManager socketManager;

	@Override
	public void execute(MsgData msg,WebSocket socket) {
		socketManager.add(socket, msg);
		String room=msg.getRoom();//目标用户
		List<WebSocket> list=socketManager.getSocketByRoom(room);
		for(WebSocket ws:list) {
			ws.send(msg.toJson());
		}
		
	}

}
