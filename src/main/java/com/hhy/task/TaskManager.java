package com.hhy.task;

import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.hhy.bean.ConParam;
import com.hhy.bean.MsgData;
import com.hhy.task.process.P2PJoinProcess;
import com.hhy.task.process.TaskProcess;
/**
 * 多线程 websocket 数据解析分发出来
 * @author huanghaiyun
 * @createTime 2017年9月11日
 *
 */
@Service
public class TaskManager {

	@Autowired
	private P2PJoinProcess p2pJoin;
	@Autowired
	private TaskExecutor taskExecutor;  

	public TaskManager() {
		System.out.println("TaskManager");
	}

	public void executeMsg(String msg,WebSocket socket) {            
		taskExecutor.execute(new MsgTask(msg,socket)); 
	}  

	private class MsgTask implements Runnable {  
		private String msg;
		private WebSocket socket;
		public MsgTask(String msg,WebSocket socket) { 
			this.msg=msg;
			this.socket=socket;
		}      
		public void run() {        
			MsgData msgData=JSON.parseObject(msg, MsgData.class);
			TaskProcess process=getProcess(msgData);
			process.execute(msgData, socket);

		}  
		private TaskProcess getProcess(MsgData msgData) {
			if(msgData.getType()!=null) {
				switch (msgData.getType()) {
					case ConParam.CHAT_P2P_JOIN:return p2pJoin;
					default:return p2pJoin;
				}        	
			}else {
				return p2pJoin;
			}

		}
	}  
}
