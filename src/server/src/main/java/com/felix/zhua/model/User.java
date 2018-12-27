package com.felix.zhua.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class User implements Serializable {
	private int id;
	private String email;
}
