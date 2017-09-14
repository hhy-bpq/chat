package com.hhy.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.bidimap.DualHashBidiMap;
import org.apache.commons.lang3.StringUtils;
import org.java_websocket.WebSocket;

import com.hhy.common.MsgData;
import com.sun.org.apache.xalan.internal.xsltc.compiler.sym;

/**
 * 用户socket 管理
 * @author huanghaiyun
 * @createTime 2017年9月6日
 *
 */
public class UserSocketManager2 {

	private static final UserSocketManager2 INSTANCE=new UserSocketManager2();
	
	private Map<String,DualHashBidiMap> userMap;//key:user;value:DualHashBidiMap key:roomId ;value:socket
	private Map<WebSocket,String> socketMap;//key：socket ；value:user
	private List<WebSocket> otherList;//其他socket类型
	private Map<String,List<String>>groupMap;//key:roomId(组名称即roomId);value:user
	private UserSocketManager2() {
		userMap=new HashMap<String,DualHashBidiMap>();
		socketMap=new HashMap<WebSocket,String>();
		groupMap=new HashMap<String,List<String>>();
		otherList=new ArrayList<WebSocket>();
		
	}
	public static UserSocketManager2 getInstance() {
		return INSTANCE;
	}
	/**
	 * 添加链接
	 * @param socket
	 * @param msg
	 */
	public void add(WebSocket socket,MsgData msg) {
		String user=msg.getUser();
		String roomId=msg.getUser();
		if(!StringUtils.isEmpty(user)&&!StringUtils.isEmpty(roomId)) {
			synchronized (userMap) {
				DualHashBidiMap bidMap=userMap.get(user);
				if(bidMap==null) {
					bidMap=new DualHashBidiMap();
				}
				bidMap.put(roomId, socket);
				userMap.put(user, bidMap);
			}
			synchronized (groupMap) {
				List<String> groupList=groupMap.get(roomId);
				if(groupList==null) {
					groupList=new ArrayList<String>();
				}
				groupList.add(user);
				groupMap.put(roomId, groupList);
			}
			synchronized (socketMap) {
				socketMap.put(socket, user);
			}
		}else {
			otherList.add(socket);
		}
		
	}
	/**
	 * 移除链接
	 * @param socket
	 */
	public void remove(WebSocket socket) {
		String user=socketMap.get(socket);
		if(user!=null) {
			synchronized (socketMap) {
				socketMap.remove(socket);
			}
			String group="";
			synchronized (userMap) {
				DualHashBidiMap bidMap=userMap.get(user);
				group=(String) bidMap.getKey(socket);
				bidMap.removeValue(socket);
			}
			synchronized (groupMap) {
				List<String> groupList=groupMap.get(group);
				if(groupList!=null&&groupList.size()>0) {
					groupList.remove(user);
				}
				if(groupList.isEmpty()) {
					groupMap.remove(group);
				}
			}
		}else {
			otherList.remove(socket);
		}
	}

	/**
	 * 根据roomId 获取socket
	 * @param socket
	 */
	public List<WebSocket> getSocketByGroup(String group) {
		List<WebSocket> list=new ArrayList<WebSocket>();
		synchronized (groupMap) {
			List<String> userList=groupMap.get(group);
			if(userList!=null&&userList.size()>0) {
				for(String user:userList) {
					synchronized (userMap) {
						DualHashBidiMap bidMap=userMap.get(user);
						if(bidMap!=null&&bidMap.size()>0) {
							WebSocket ws=(WebSocket) bidMap.get(group);
							if(ws!=null) {
								list.add(ws);
							}
						}
					}
				}
			}
		}
		return list;
	}
	/**
	 * 根据user 获取socket
	 * @param socket
	 */
	public List<WebSocket> getSocketByUser(String user) {
		List<WebSocket> list=new ArrayList<WebSocket>();
		synchronized (userMap) {
			DualHashBidiMap bidMap=userMap.get(user);
			if(bidMap!=null&&bidMap.size()<0) {
				for(WebSocket socket:(Set<WebSocket>)bidMap.keySet()) {
					list.add(socket);
				}
			}
		}
		return list;
	}
}
