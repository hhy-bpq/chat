package com.hhy.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.java_websocket.WebSocket;
import org.springframework.stereotype.Service;

import com.hhy.common.MsgData;

/**
 * 用户socket 管理
 * @author huanghaiyun
 * @createTime 2017年9月6日
 *
 */
@Service
public class UserSocketManager {

//	private static final UserSocketManager INSTANCE=new UserSocketManager();
	private static final String ROOM="room";
	private static final String USER="user";
	
	private Map<String,List<WebSocket>> roomMap;//不同room 对应的socket列表
	private Map<String,List<WebSocket>> userMap;//不同user 对应的socket列表
	private Map<WebSocket,Map<String,String>> socketMap;//key：socket ；value:room
	private List<WebSocket> otherList;//其他socket类型
	public UserSocketManager() {
		roomMap=new HashMap<String,List<WebSocket>>();
		userMap=new HashMap<String,List<WebSocket>>();
		socketMap=new HashMap<WebSocket,Map<String,String>>();
		otherList=new ArrayList<WebSocket>();
		
	}
//	public static UserSocketManager getInstance() {
//		return INSTANCE;
//	}
	/**
	 * 添加链接
	 * @param socket
	 * @param msg
	 */
	public void add(WebSocket socket,MsgData msg) {
		String room=msg.getRoom();
		String user=msg.getUser();
		if(!StringUtils.isEmpty(room)&&!StringUtils.isEmpty(user)) {
			synchronized (roomMap) {
				List<WebSocket> list=roomMap.get(room);
				if(list==null) {
					list=new ArrayList<WebSocket>();
				}
				if(list.indexOf(socket)==-1) {
					
					list.add(socket);
				}
				roomMap.put(room, list);
			}
			synchronized (userMap) {
				List<WebSocket> list=userMap.get(user);
				if(list==null) {
					list=new ArrayList<WebSocket>();
				}
				if(list.indexOf(socket)==-1) {
					
					list.add(socket);
				}
				userMap.put(user, list);
			}
			synchronized (socketMap) {
				Map<String,String> map=new HashMap<String,String>();
				map.put(USER, user);
				map.put(ROOM, room);
				socketMap.put(socket, map);
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
		Map<String,String> map=socketMap.get(socket);
		if(map!=null&&map.get(ROOM)!=null&&map.get(USER)!=null) {
			String room=map.get(ROOM);
			String user=map.get(USER);
			synchronized (socketMap) {
				socketMap.remove(socket);
			}
			synchronized (roomMap) {
				List<WebSocket> list=roomMap.get(room);
				if(list!=null&&!list.isEmpty()) {
					list.remove(socket);
				}
				if(list!=null&&list.isEmpty()) {//列表空了 清空房间
					roomMap.remove(room);
				}
			}
			synchronized (userMap) {
				List<WebSocket> list=userMap.get(user);
				if(list!=null&&!list.isEmpty()) {
					list.remove(socket);
				}
				if(list!=null&&list.isEmpty()) {//列表空了 清空user
					userMap.remove(room);
				}
			}
		}else {
			otherList.remove(socket);
		}
	}

	/**
	 * 根据room 获取socket
	 * @param socket
	 */
	public List<WebSocket> getSocketByRoom(String room) {
		synchronized (roomMap) {
			List<WebSocket> list=roomMap.get(room);
			if(list==null) {
				list=new ArrayList<WebSocket>();
			}
			return list;
		}
	}
	/**
	 * 根据user 获取socket
	 * @param socket
	 */
	public List<WebSocket> getSocketByUser(String user) {
		synchronized (userMap) {
			List<WebSocket> list=userMap.get(user);
			if(list==null) {
				list=new ArrayList<WebSocket>();
			}
			return list;
		}
	}
}
