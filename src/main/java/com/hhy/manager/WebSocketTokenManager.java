package com.hhy.manager;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hhy.util.MD5Util;
/**
 * websocket joing 报文的tocken 校验
 * @author huanghaiyun
 * @createTime 2017年9月27日
 *
 */
public class WebSocketTokenManager {
	private static final Logger LOG =  LoggerFactory.getLogger(WebSocketTokenManager.class);
	private static final WebSocketTokenManager INSTANCE=new WebSocketTokenManager();
	private static final String SEPARATOR="-";//拼接字符用的 分隔符
	private static final long TIMEOUT=(long) (60*1000);//token超时时间
	private static final int SIZE=1000;//list 大小 超出后将主动清除超时的token
	private Map<String,WebSocketToken> tokenList=new HashMap<String,WebSocketToken>();
	private WebSocketTokenManager() {
	}
	
	public static WebSocketTokenManager getInstance() {
		return INSTANCE;
	}

	public String createToken(String name) {
		WebSocketToken tokenMsg=new WebSocketToken(name);
		String token=tokenMsg.toTokenString();
		synchronized (tokenList) {
			if(tokenList.size()>SIZE) {
				clean();
			}
			tokenList.put(token,tokenMsg);
		}
		return token;
	};
	/**
	 * websocketToken 校验
	 * @param user
	 * @param token
	 * @return
	 */
	public boolean check(String user,String token) {
		String []tokens=token.trim().split(SEPARATOR);
		int rand=Integer.valueOf(tokens[tokens.length-1]);
		WebSocketToken tokenMsg=tokenList.get(token);
		Long time=new Date().getTime();
		if(tokenMsg!=null) {
			if(tokenMsg.getName().equals(user)&&
					(time-tokenMsg.createTime)<TIMEOUT&&
					rand==tokenMsg.getRamdom()) {
				synchronized (tokenList) {
					tokenList.remove(token);
				}
				return true;
			}
		}
		LOG.info("token 校验失败\troken:"+token+"\t user:"+user);
		return false;

	}

	/**
	 * 将超时的 token清除
	 */
	private void clean() {
		List<String> keyList=new ArrayList<>();
		long time=new Date().getTime();
		for(String key:tokenList.keySet()) {
			WebSocketToken webSocketToken=tokenList.get(key);
			if((time-webSocketToken.getCreateTime())>TIMEOUT){
				keyList.add(key);
			}
		}
		for(String key:keyList) {
			tokenList.remove(key);
			LOG.info("clean tokenList token:"+key);
		}
	}
	/**
	 * websocket 的token 信息类
	 * @author huanghaiyun
	 * @createTime 2017年9月27日
	 *
	 */
	private class WebSocketToken{
		private String name;
		private long createTime;
		private long ramdom;
		public WebSocketToken(String name) {
			this.name=name;
			createTime=new Date().getTime();
			ramdom=new Random().nextInt(1000);
		}
		public String toTokenString() {
			StringBuilder token=new StringBuilder();
			token.append(this.name)
			.append(SEPARATOR).
			append(this.createTime);
			//			String md5=MD5Util.encode(token.toString());
			return MD5Util.encode(token.toString())+SEPARATOR+ramdom;
		}
		public String getName() {
			return name;
		}
		public long getCreateTime() {
			return createTime;
		}
		public long getRamdom() {
			return ramdom;
		}
	}
	public static void main(String[] args) {
		try {
			WebSocketTokenManager tk=WebSocketTokenManager.getInstance();
			System.out.println(tk.createToken("hhy"));
			System.out.println(tk.createToken("hhy2"));
			System.out.println(tk.createToken("hhy1"));
			System.out.println(tk.createToken("hhy3"));
			System.out.println(tk.createToken("hhy"));
			Thread.sleep(2000);
			System.out.println(tk.createToken("hhy"));
			System.out.println(tk.createToken("hhy"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
