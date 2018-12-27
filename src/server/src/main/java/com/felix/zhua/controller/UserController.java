package com.felix.zhua.controller;

import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.Result;
import com.felix.zhua.model.User;
import com.felix.zhua.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;

	@RequestMapping(value="", method = RequestMethod.GET)
	public List<User> users() {
		return userService.users();
	}

	@Data
	private static class LoginParams {
		private String username;
		private String password;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public Result<LoginInfo> login(@RequestBody LoginParams loginParams) {
		LoginInfo loginInfo = userService.login(loginParams.username, loginParams.password);
		Result<LoginInfo> result = new Result<LoginInfo>();
		result.setResult(loginInfo != null);
		result.setData(loginInfo);
		return result;
	}

	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public Result<Boolean> logout(){
		userService.logout();
		Result<Boolean> result = new Result<Boolean>();
		result.setResult(true);
		return result;
	}

	@RequestMapping(value="/loginInfo", method = RequestMethod.GET)
	public LoginInfo loginInfo(HttpServletRequest request) {
		HttpSession session = request.getSession();
		return (LoginInfo) session.getAttribute("loginInfo");
	}
}
