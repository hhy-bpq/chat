package com.hhy.task.process;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hhy.bean.MsgData;
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
		socketManager.remove(socket);
		
	}

}
