package com.felix.zhua.aop;

import com.felix.zhua.model.Result;
import com.felix.zhua.model.ZhuaException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.validation.ConstraintViolationException;

/**
 * Created by felix on 2019/1/1.
 * 处理所有 Java 代码的异常, 并以 restful 风格返回
 */
@RestControllerAdvice
public class GlobalControllerExceptionHandler {
	@ExceptionHandler(value = { ConstraintViolationException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Result<Object> constraintViolationException(ConstraintViolationException ex) {
		return new Result<>(false, ex.getMessage(), null);
	}

	@ExceptionHandler(value = { IllegalArgumentException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Result<Object> IllegalArgumentException(IllegalArgumentException ex) {
		return new Result<>(false, ex.getMessage(), null);
	}

	@ExceptionHandler(value = { NoHandlerFoundException.class })
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public Result<Object> noHandlerFoundException(Exception ex) {
		return new Result<>(false, ex.getMessage(), null);
	}


	@ExceptionHandler(value = { Exception.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Result<Object> unknownException(Exception ex) {
		return new Result<>(false, ex.getMessage(), null);
	}

	@ExceptionHandler(value = {ZhuaException.class})
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Result<Object> zhuaException(ZhuaException ex) {
		return new Result<>(false, ex.getMessage(), null);
	}
}
