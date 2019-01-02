package com.felix.zhua.controller;

import com.felix.zhua.aop.WithoutLogin;
import com.felix.zhua.model.Pager;
import com.felix.zhua.model.Project;
import com.felix.zhua.model.Result;
import com.felix.zhua.service.ProjectService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("projects")
@Api("项目")
public class ProjectController {

	@Autowired
	ProjectService projectService;

	@Data
	private static class RecentAndPopular {
		private List<Project> recent;
		private List<Project> popular;
	}

	@WithoutLogin
	@ApiOperation(value = "项目列表, 最新 & 最热")
	@RequestMapping(value = "/rap", method = RequestMethod.GET)
	public RecentAndPopular getRecentAndPopular() {
		Pager<Project> pageRecent = projectService.listRecent(0, 8);
		Pager<Project> pagePopular = projectService.listPopular(0, 8);
		RecentAndPopular recentAndPopular = new RecentAndPopular();
		recentAndPopular.setRecent(pageRecent.getData());
		recentAndPopular.setPopular(pagePopular.getData());
		return recentAndPopular;
	}

	@ApiOperation(value = "项目(最新)列表, 带分页, 关键字搜索")
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Pager<Project> projects(@RequestParam(required = false) String keyword, @RequestParam(required = false, defaultValue = "0") int page) {
		if (keyword != null && !keyword.trim().isEmpty()) {
			return projectService.find(keyword, page);
		} else {
			return projectService.listRecent(page, 10);
		}
	}

	@ApiOperation(value = "创建项目")
	@RequestMapping(value = "", method = RequestMethod.POST)
	public Project create(@RequestBody Project project) {
		return projectService.create(project);
	}

	@ApiOperation(value = "修改项目data")
	@RequestMapping(value = "/{id}/data", method = RequestMethod.PUT)
	public Result<Project> setData(@PathVariable int id, @RequestBody Project project) {
		Result<Project> result = new Result<Project>();
		result.setResult(projectService.setData(id, project.getData()));
		return result;
	}

	@WithoutLogin
	@ApiOperation(value = "获取单个项目信息")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Project getById(@PathVariable int id) {
		return projectService.getById(id);
	}

	@ApiOperation(value = "我的项目列表")
	@RequestMapping(value = "/my/", method = RequestMethod.GET)
	public List<Project> myProjects() {
		return projectService.myProject();
	}

	@ApiOperation(value = "rating ++")
	@RequestMapping(value = "/{id}/rating", method = RequestMethod.PUT)
	public Result incRating(int id) {
		projectService.incRating(id);
		return new Result(true, null, null);
	}
}
