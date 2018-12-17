package com.felix.zhua.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class User {
	@RequestMapping
	public String index(){
		return "show me";
	}
}
