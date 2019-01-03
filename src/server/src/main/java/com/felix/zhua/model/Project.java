package com.felix.zhua.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.io.Serializable;
import java.math.BigInteger;

@Data
public class Project implements Serializable {
	private int id;
	private int ownerId;
	private String ownerEmail;
	private BigInteger createTime;
	private BigInteger modifyTime;
	private String name;
	private String siteURL;
	private String siteTitle;
	private boolean privately;
	private String data;
	private Integer rating;

	@Data
	@Document(indexName = "zhua", type = "project", shards = 1, replicas = 0, refreshInterval = "-1")
	public static class ES {
		@Id
		private Integer id;
		private String name;
		private String siteURL;
		private String siteTitle;
		private Integer rating;
	}

	public ES toES() {
		ES es = new ES();
		es.setId(this.id);
		es.setName(this.name);
		es.setSiteURL(this.siteURL);
		es.setSiteTitle(this.siteTitle);
		es.setRating(this.rating);
		return es;
	}
}
