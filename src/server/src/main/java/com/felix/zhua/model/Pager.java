package com.felix.zhua.model;

import lombok.Data;

import java.util.List;

@Data
public class Pager<T> {
	private int page;
	private int pageCount;
	private int recordCount;
	private List<T> data;

	public Pager() {
	}

	public Pager(int page, int pageCount, int recordCount, List<T> data) {
		this.page = page;
		this.pageCount = pageCount;
		this.recordCount = recordCount;
		this.data = data;
	}
}
