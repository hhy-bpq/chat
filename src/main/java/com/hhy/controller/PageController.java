package com.hhy.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.hhy.bean.SysPerson;
import com.hhy.bean.SysUser;
import com.hhy.dao.SysPersonDao;
import com.hhy.dao.SysUserDao;



@Controller
@EnableAutoConfiguration 
public class PageController {
	@Autowired
	private SysUserDao userDao;
	@Autowired
	private SysPersonDao personDao;
	
	@RequestMapping("/chat")
	public String loginPage(String user,Model model){
		if(user==null) {
			user=UUID.randomUUID().toString();
		}
//		SysUser entity=new SysUser();
//		entity.setPassWord("2w1");
//		entity.setAccount("adsa");
//		SysPerson person=new SysPerson();
//		person.setName("asdsad123");
//		entity.setPerson(person);
//		userDao.save(entity);
		model.addAttribute("user", user);
		model.addAttribute("pic", "../img/a1.jpg");
		return "chat";
	}

}
