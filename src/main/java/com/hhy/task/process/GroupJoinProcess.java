package com.hhy.task.process;

import java.util.List;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.hhy.common.ConParam;
import com.hhy.common.MsgData;
import com.hhy.manager.UserSocketManager;
/**
 * 组聊天信息
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
@Service
public class GroupJoinProcess implements TaskProcess{
	@Autowired
	private UserSocketManager socketManager;

	@Override
	public void execute(MsgData msg,WebSocket socket) {
		socketManager.add(socket, msg);//添加到用户缓存中
		String room=msg.getRoom();
		if(!StringUtils.isEmpty(room)) {
			List<WebSocket> list=socketManager.getSocketByRoom(room);
			for(WebSocket webSocket:list) {
				webSocket.send(msg.toJson());
			}
		}
	}

}
