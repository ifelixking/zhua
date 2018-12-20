package com.felix.zhua.controller;

import com.felix.zhua.model.User;
import com.felix.zhua.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;

	@RequestMapping("")
	public List<User> users(){
		return userService.users();
	}
}
