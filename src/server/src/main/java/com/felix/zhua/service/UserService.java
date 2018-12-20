package com.felix.zhua.service;

import com.felix.zhua.mapper.UserMapper;
import com.felix.zhua.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
	@Autowired
	UserMapper userMapper;

	public List<User> users(){
		return userMapper.users();
	}
}
