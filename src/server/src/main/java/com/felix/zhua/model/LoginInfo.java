package com.felix.zhua.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginInfo implements Serializable {
	private int userId;
	private String username;
}
