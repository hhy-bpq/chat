package com.hhy.task;

import org.java_websocket.WebSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.hhy.common.ConParam;
import com.hhy.common.MsgData;
import com.hhy.task.process.CloseProcess;
import com.hhy.task.process.GroupJoinProcess;
import com.hhy.task.process.GroupProcess;
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
	
	private static final Logger LOG =  LoggerFactory.getLogger(TaskManager.class);

	@Autowired
	private P2PJoinProcess p2pJoin;
	@Autowired
	private CloseProcess close;
	@Autowired
	private GroupProcess group;
	@Autowired
	private GroupJoinProcess groupJoin;
	@Autowired
	private TaskExecutor taskExecutor;  

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
			try {
				MsgData msgData=JSON.parseObject(msg, MsgData.class);
				TaskProcess process=getProcess(msgData);
				process.execute(msgData, socket);
			} catch (Exception e) {
				LOG.error("TaskManager error: \t"+e);
			}

		}  
		private TaskProcess getProcess(MsgData msgData) {
			switch (msgData.getType()) {
				case ConParam.CHAT_P2P_JOIN:return p2pJoin;
				case ConParam.ERROR:return close;
				case ConParam.CHAT_GROUP_MSG:return group;
				case ConParam.CHAT_GROUP_JOIN:return groupJoin;
				default:return close;
			}   

		}
	}  
}
