package com.felix.zhua.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Result {
	private boolean result;
	private String desc;
	private Serializable data;
}
