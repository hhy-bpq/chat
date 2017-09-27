package com.hhy.task.process;

import org.java_websocket.WebSocket;

import com.hhy.common.MsgData;

/**
 * 数据处理
 * @author huanghaiyun
 * @createTime 2017年9月7日
 *
 */
public interface TaskProcess {
	
	/**
	 * 
	 * @param msg
	 * @param socket
	 */
	public void execute(MsgData msg,WebSocket socket) ;
	
	/**
	 * 校验 socket 是否有效
	 * @param msg
	 * @param socket
	 */
	public boolean check(MsgData msg,WebSocket socket) ;
}
