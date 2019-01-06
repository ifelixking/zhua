package com.felix.zhua.service;

import com.felix.zhua.mapper.ProjectMapper;
import com.felix.zhua.mapper.ProjectMapperES;
import com.felix.zhua.mapper.ProjectMapperW;
import com.felix.zhua.mapper.RatingMapper;
import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.Pager;
import com.felix.zhua.model.Project;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
	@Autowired
	ProjectMapper projectMapper;

	@Autowired
	ProjectMapperW projectMapperW;

	@Autowired
	RatingMapper ratingMapper;

	@Autowired
	private UserService userService;

	@Autowired
	private ProjectMapperES projectMapperES;

	public Pager<Project> listRecent(int page, int pageSize) {
		int count = projectMapper.listCount();
		List<Project> list = projectMapper.listRecent(page * pageSize, pageSize);
		return new Pager<>(page, (int) Math.ceil((double) count / pageSize), count, list);
	}

	public Pager<Project> listPopular(int page, int pageSize) {
		int count = projectMapper.listCount();
		List<Project> list = projectMapper.listPopular(page * pageSize, pageSize);
		return new Pager<>(page, (int) Math.ceil((double) count / pageSize), count, list);
	}

	public Project create(Project project) {
		LoginInfo loginInfo = userService.loginInfo();
		project.setOwnerId(loginInfo.getUserId());
		projectMapperW.create(project);
		projectMapperES.save(project.toES());
		return project;
	}

	public Project getById(int id) {
		return projectMapperW.getById(id);
	}

	public Pager<Project> find(String keyword, int page) {
		int pageSize = 10;
		Pageable pageable = PageRequest.of(page, pageSize);
		QueryStringQueryBuilder builder = new QueryStringQueryBuilder(keyword);
		SearchQuery searchQuery = new NativeSearchQueryBuilder().withPageable(pageable).withQuery(builder).build();
		Page<Project.ES> searchPageResults = projectMapperES.search(searchQuery);
		List<Project.ES> listES = searchPageResults.getContent();
		List<Project> list = new ArrayList<>(listES.size());
		for (Project.ES item : listES) {
			list.add(projectMapper.getById4List(item.getId()));
		}
		return new Pager<>(page, searchPageResults.getTotalPages(), (int) searchPageResults.getTotalElements(), list);
	}

	public boolean setData(int id, String data) {
		return projectMapperW.setData(id, data);
	}

	public List<Project> myProject() {
		LoginInfo loginInfo = userService.loginInfo();
		int userId = loginInfo.getUserId();
		return projectMapperW.getProjectsByOwnerId(userId);
	}

	public void incOpen(int id) {
		ratingMapper.inc(id, "project-open");
	}

}
