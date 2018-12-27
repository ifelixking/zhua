package com.felix.zhua.service;

import com.felix.zhua.mapper.ProjectMapper;
import com.felix.zhua.model.Pager;
import com.felix.zhua.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
	@Autowired
	ProjectMapper projectMapper;

	public Pager<Project> list(int page) {
		int pageSize = 10;
		int count = projectMapper.count();
		List<Project> list = projectMapper.list(page * pageSize, pageSize);
		Pager pager = new Pager();
		pager.setRecordCount(count);
		pager.setPage(page);
		pager.setPageCount((int) Math.ceil((double)count / pageSize));
		pager.setData(list);
		return pager;
	}

	public Project create(Project project) {
		projectMapper.create(project);
		return project;
	}

	public Project getById(int id) {
		return projectMapper.getById(id);
	}

	public Pager<Project> find(String keyword, int page) {
		int pageSize = 10;
		int count = projectMapper.findCount(keyword);
		List<Project> list = projectMapper.find(keyword, pageSize * page, pageSize);
		Pager pager = new Pager();
		pager.setRecordCount(count);
		pager.setPage(page);
		pager.setPageCount((int) Math.ceil((double)count / pageSize));
		pager.setData(list);
		return pager;
	}

	public boolean setData(int id, String data) {
		return projectMapper.setData(id, data);
	}
}
