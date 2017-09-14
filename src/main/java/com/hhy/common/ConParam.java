package com.hhy.common;

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
	 * 系统信息
	 */
	public static final int SYS_INFO_SIZE=1;
	/**
	 * 单人聊天 join
	 */
	public static final int CHAT_P2P_JOIN=10;
	/**
	 * 单人聊天 msg
	 */
	public static final int CHAT_P2P_MSG=11;
	/**
	 * 组聊天join
	 */
	public static final int CHAT_GROUP_JOIN=20;
	/**
	 * 组聊天msg
	 */
	public static final int CHAT_GROUP_MSG=21;
	/**
	 * 其他socket
	 */
	public static final int MSG_TYPE_CHAT_OTHER=30;
	/**
	 * 异常socket
	 */
	public static final int ERROR=0;

}
