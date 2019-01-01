package com.felix.zhua.controller;

import com.felix.zhua.aop.WithoutLogin;
import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.Result;
import com.felix.zhua.model.User;
import com.felix.zhua.service.UserService;
import com.sun.org.apache.xpath.internal.operations.Bool;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;

	@ApiOperation(value = "用户列表")
	@RequestMapping(value = "", method = RequestMethod.GET)
	public List<User> users() {
		return userService.users();
	}

	@Data
	private static class LoginParams {
		private String username;
		private String password;
	}

	@ApiOperation(value = "用户登录")
	@WithoutLogin
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public Result<LoginInfo> login(@RequestBody LoginParams loginParams) {
		LoginInfo loginInfo = userService.login(loginParams.username, loginParams.password);
		return new Result<LoginInfo>(loginInfo != null, null, loginInfo);
	}

	@ApiOperation(value = "用户注销")
	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public Result<Boolean> logout() {
		userService.logout();
		Result<Boolean> result = new Result<Boolean>();
		result.setResult(true);
		return result;
	}

	@ApiOperation(value = "当前登录信息")
	@RequestMapping(value = "/loginInfo", method = RequestMethod.GET)
	public LoginInfo loginInfo() {
		return userService.loginInfo();
	}

	@Data
	private static class RegisteParams {
		private String email;
		private String password;
	}

	@ApiOperation(value = "用户注册")
	@RequestMapping(value = "", method = RequestMethod.POST)
	public Result<LoginInfo> registe(@RequestBody RegisteParams registeParams) {
		userService.registe(registeParams.getEmail(), registeParams.getPassword());
		LoginInfo loginInfo = userService.login(registeParams.getEmail(), registeParams.getPassword());
		return new Result<>(loginInfo != null, null, loginInfo);
	}

	@ApiOperation(value="邮箱是否已注册")
	@RequestMapping(value = "/email/exists", method = RequestMethod.GET)
	public Result<Boolean> emailExists(@RequestParam String email){
		boolean exists = userService.emailExists(email);
		return new Result<>(true, null, exists);
	}
}
