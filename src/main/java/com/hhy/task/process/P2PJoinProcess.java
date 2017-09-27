package com.hhy.task.process;

import java.util.List;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hhy.common.MsgData;
import com.hhy.manager.UserSocketManager;
/**
 * 单人聊天请求socket
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
@Service
public class P2PJoinProcess implements TaskProcess{
	@Autowired
	private UserSocketManager socketManager;

	@Override
	public void execute(MsgData msg,WebSocket socket) {
		socketManager.add(socket, msg);
		String tarUser=msg.getTarUser();//目标用户
		List<WebSocket> list=socketManager.getSocketByUser(tarUser);
		if(list.size()>0) {
			for(WebSocket ws:list) {
				ws.send(msg.toJson());
				
			}
		}else {
			socket.send(msg.toJson());
			MsgData md=new MsgData();
			md.setErrorMsg("对方已离线!");
			socket.send(md.toJson());
		}
		
	}
	@Override
	public boolean check(MsgData msg, WebSocket socket) {
		return false;
	}

}
