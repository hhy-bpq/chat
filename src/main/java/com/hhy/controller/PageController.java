package com.hhy.controller;

import java.util.UUID;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@EnableAutoConfiguration 
public class PageController {
	
	@RequestMapping("/login")
	public String loginPage(String user,Model model){
		if(user==null) {
			user=UUID.randomUUID().toString();
		}
		model.addAttribute("user", user);
		model.addAttribute("pic", "../img/a1.jpg");
		return "chat";
	}

}
