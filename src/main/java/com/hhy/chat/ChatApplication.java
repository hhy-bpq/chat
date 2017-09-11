package com.hhy.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;

import com.hhy.service.WebSocketService;

@ComponentScan(value = {"com.hhy.controller","com.hhy.manager","com.hhy.service","com.hhy.task"})  
@ImportResource(locations={"classpath:application-thread.xml"})
@SpringBootApplication
public class ChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}
}
