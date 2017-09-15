package com.hhy.bean;

import com.alibaba.fastjson.JSON;

public class BaseBean{
	
	public String toJsonString() {
		return JSON.toJSONString(this);
	}

}
