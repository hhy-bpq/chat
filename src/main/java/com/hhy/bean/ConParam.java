package com.hhy.bean;

/**
 * 常量值
 * @author huanghaiyun
 * @createTime 2017年9月6日
 *
 */
public class ConParam {
	private ConParam(){
		
	}
	/**
	 * 单人聊天 join
	 */
	public static final int CHAT_P2P_JOIN=1;
	/**
	 * 单人聊天 msg
	 */
	public static final int CHAT_P2P_MSG=2;
	/**
	 * 组聊天join
	 */
	public static final int CHAT_GROUP_JOIN=11;
	/**
	 * 组聊天msg
	 */
	public static final int CHAT_GROUP_MSG=12;
	/**
	 * 其他socket
	 */
	public static final int MSG_TYPE_CHAT_OTHER=0;

}
