package com.hhy.task.process;

import java.util.List;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.hhy.common.ConParam;
import com.hhy.common.ErrorMsg;
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
//		socketManager.add(socket, msg);
		if(check(msg,socket)) {
			String room=msg.getRoom();//目标用户
			List<WebSocket> list=socketManager.getSocketByRoom(room);
			for(WebSocket ws:list) {
				ws.send(msg.toJson());
			}
		}else {
			MsgData msgData=new MsgData();
			msgData.setType(ConParam.SYS_NOT_ALLOW);
			msgData.setErrorMsg(ErrorMsg.SYS_NOT_ALLOW);
			socket.send(msgData.toJson());
			socket.close();
		}
		
	}
	@Override
	public boolean check(MsgData msg, WebSocket socket) {
		String room=msg.getRoom();//目标用户
		String tarRoom=socketManager.getRoomBySocket(socket);
		if(!StringUtils.isEmpty(room)&&!StringUtils.isEmpty(tarRoom)
				&&room.equals(tarRoom)) {
			return true;
		}
		return false;
		
	}

}
