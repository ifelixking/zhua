package com.felix.zhua.service;

import com.felix.zhua.mapper.UserMapper;
import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Service
public class UserService {
	@Autowired
	private UserMapper userMapper;

	@Autowired
	private HttpServletRequest request;

	public List<User> users() {
		return userMapper.users();
	}

	public LoginInfo login(String username, String password) {
		HttpSession session = request.getSession();
		session.setAttribute("loginInfo", null);
		User user = userMapper.getUserByUsernamePassword(username, password);
		if (user == null) {
			return null;
		}
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setUserId(user.getId());
		loginInfo.setUsername(user.getEmail());
		session.setAttribute("loginInfo", loginInfo);
		return loginInfo;
	}

	public void logout(){
		HttpSession session = request.getSession();
		session.setAttribute("loginInfo", null);
	}
}