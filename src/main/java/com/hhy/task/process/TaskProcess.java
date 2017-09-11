package com.hhy.task.process;

import org.java_websocket.WebSocket;

import com.hhy.bean.MsgData;

/**
 * 数据处理
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
public interface TaskProcess {
	
	/**
	 * 处理
	 * @param msg 需要处理的数据
	 */
	public void execute(MsgData msg,WebSocket socket) ;
}
