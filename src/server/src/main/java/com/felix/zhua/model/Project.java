package com.felix.zhua.model;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Project {
	private int id;
	private int ownerId;
	private String ownerName;
	private Timestamp createTime;
	private Timestamp modifyTime;
	private String name;
	private String siteURL;
	private String siteTitle;
	private boolean privately;
}
