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
 * 出现异常后的处理
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
@Service
public class CloseProcess implements TaskProcess{
	@Autowired
	private UserSocketManager socketManager;

	@Override
	public void execute(MsgData msg,WebSocket socket) {
		String room=socketManager.getRoomBySocket(socket);
		String user=socketManager.getUserBySocket(socket);
		socketManager.remove(socket);
		if(!StringUtils.isEmpty(room)) {
			MsgData msgData=new MsgData();
			msgData.setUser(user);
			msgData.setRoom(room);
			msgData.setType(ConParam.MSG_TYPE_CHAT_OFFLINE);
			List<WebSocket> list=socketManager.getSocketByRoom(room);
			for(WebSocket webSocket:list) {
				webSocket.send(msgData.toJson());
			}
		}
		
		
		
	}

}
