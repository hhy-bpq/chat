package com.hhy.common;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSON;
/**
 * websocket数据解析
 * @author huanghaiyun
 * @createTime 2017年9月6日
 *
 */
public class MsgData {
	//发送人
	private String user;
	//发送人头像url
	private String pic;
	//socket类型
	private Integer type;
	//聊天室
	private String room;
	//实际数据
	private String msg;
	//接收人
	private String tarUser;
	//实际数据
	private String errorMsg;
	//创建时间
	private String date;
	public MsgData() {
		Map<String,String> map=new HashMap<String,String>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		date=formatter.format(new Date());
	}
	
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	
	public String getRoom() {
		return room;
	}
	public void setRoom(String room) {
		this.room = room;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	public String getTarUser() {
		return tarUser;
	}
	public void setTarUser(String tarUser) {
		this.tarUser = tarUser;
	}
	public String getErrorMsg() {
		return errorMsg;
	}
	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	/**
	 * 转成json 字符串
	 * @return
	 */
	public String toJson() {
		String data=JSON.toJSONString(this);
		return data;
		
	}

}
