package com.hhy.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Base64Utils;

public class MD5Util {

	private static final Logger LOG =  LoggerFactory.getLogger(MD5Util.class);
	private static final String KEY = "HHY";

	public static String encode(String src) {
		String result="";
		String realData=KEY+src;
		try {
			MessageDigest md5= MessageDigest.getInstance("MD5");
			byte[] buff=md5.digest(realData.getBytes());
			result=Base64Utils.encodeToString(buff);
		} catch (NoSuchAlgorithmException e) {
			LOG.error("MD5 加密错误",  e);
		}
		return result;

	}
	public static void main(String[] args) {
		System.out.println(encode("admin"));
		System.out.println(encode("user"));
	}
}
