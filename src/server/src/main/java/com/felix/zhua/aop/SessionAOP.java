package com.felix.zhua.aop;

import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.ZhuaException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Aspect
@Component
public class SessionAOP {
	@Before(value = "execution(* com.felix.zhua.controller..*.*(..))")
	public void validLoginInfo(JoinPoint joinPoint) throws Throwable {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		HttpSession session = request.getSession();
		LoginInfo loginInfo = (LoginInfo)session.getAttribute("loginInfo");
		if (loginInfo == null){
			throw new ZhuaException("not login yet");
		}
	}
}
