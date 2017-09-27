package com.hhy.controller;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.hhy.bean.SysPermission;
import com.hhy.bean.SysPerson;
import com.hhy.bean.SysUser;
import com.hhy.dao.SysPermissionDao;
import com.hhy.dao.SysPersonDao;
import com.hhy.dao.SysUserDao;
import com.hhy.manager.WebSocketTokenManager;



@Controller
@EnableAutoConfiguration 
public class PageController {
	@Autowired
	private SysUserDao userDao;
	@Autowired
	private SysPersonDao personDao;
	@Autowired
	private SysPermissionDao permDao;
	
	@RequestMapping("/")
	public String chat(HttpServletRequest request,String user,Model model){
		if(user==null) {
			user=UUID.randomUUID().toString();
		}
		SecurityContextImpl securityContextImpl = (SecurityContextImpl) request  
				.getSession().getAttribute("SPRING_SECURITY_CONTEXT");
		String username=securityContextImpl.getAuthentication().getName();
		for( GrantedAuthority sa:securityContextImpl.getAuthentication().getAuthorities()) {
			System.out.println(sa.getAuthority());
		}
		SysPerson person=personDao.findPersonByUserSetUserName(username);
		String userName=person.getName();
		model.addAttribute("user", person.getName());
		model.addAttribute("pic", person.getAvatar());
		model.addAttribute("token", WebSocketTokenManager.getInstance().createToken(userName));
		return "chat";
	}

}
