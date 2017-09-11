package com.hhy.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@EnableAutoConfiguration 
public class PageController {
	
	@RequestMapping("/login")
	public String loginPage(){
		return "hello";
	}

}
