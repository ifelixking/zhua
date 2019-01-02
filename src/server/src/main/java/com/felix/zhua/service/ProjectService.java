package com.felix.zhua.service;

import com.felix.zhua.mapper.ProjectMapper;
import com.felix.zhua.mapper.ProjectMapperW;
import com.felix.zhua.mapper.ProjectRatingMapperW;
import com.felix.zhua.model.LoginInfo;
import com.felix.zhua.model.Pager;
import com.felix.zhua.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
	@Autowired
	ProjectMapper projectMapper;

	@Autowired
	ProjectMapperW projectMapperW;

	@Autowired
	ProjectRatingMapperW projectRatingMapper;

	@Autowired
	private UserService userService;

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
		return project;
	}

	public Project getById(int id) {
		Project project = projectMapperW.getById(id);
		return project;
	}

	public Pager<Project> find(String keyword, int page) {
		int pageSize = 10;
		int count = projectMapper.findCount(keyword);
		List<Project> list = projectMapper.find(keyword, pageSize * page, pageSize);
		Pager<Project> pager = new Pager<>();
		pager.setRecordCount(count);
		pager.setPage(page);
		pager.setPageCount((int) Math.ceil((double) count / pageSize));
		pager.setData(list);
		return pager;
	}

	public boolean setData(int id, String data) {
		return projectMapperW.setData(id, data);
	}

	public List<Project> myProject() {
		LoginInfo loginInfo = userService.loginInfo();
		int userId = loginInfo.getUserId();
		return projectMapperW.getProjectsByOwnerId(userId);
	}

	public void incRating(int id) {
		projectRatingMapper.inc(id);
	}

//	public int rating(int id){
//		return projectRatingMapper.value(id);
//	}
//
//	public void incRating(int id){
//		projectRatingMapper.inc(id);
//	}
}
