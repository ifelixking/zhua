package com.felix.zhua.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Result<T> {
	private boolean result;
	private String desc;
	private T data;
}
