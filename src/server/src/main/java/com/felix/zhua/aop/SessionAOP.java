package com.felix.zhua.aop;

import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.ZhuaException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

@Aspect
@Component
public class SessionAOP {
	@Before(value = "execution(* com.felix.zhua.controller..*.*(..))")
	public void validLoginInfo(JoinPoint joinPoint) throws Throwable {
		MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();
		Method method = methodSignature.getMethod();
		Annotation annotation = method.getAnnotation(WithoutLogin.class);
		if (annotation == null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			HttpSession session = request.getSession();
			LoginInfo loginInfo = (LoginInfo) session.getAttribute("loginInfo");
			if (loginInfo == null) {
				throw new ZhuaException("not login yet");
			}
		}
	}
}
