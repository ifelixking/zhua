package com.felix.zhua.model;

import lombok.Data;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
public class Project implements Serializable {
	private int id;
	private int ownerId;
	private String ownerEmail;
	private Timestamp createTime;
	private Timestamp modifyTime;
	private String name;
	private String siteURL;
	private String siteTitle;
	private boolean privately;
	private String data;
}
