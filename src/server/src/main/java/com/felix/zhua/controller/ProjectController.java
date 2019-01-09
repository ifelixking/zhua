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
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Objects;

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

	@WithoutLogin
	@ApiOperation(value = "项目(最新)列表, 带分页, 关键字搜索")
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Pager<Project> projects(@RequestParam(required = false) String keyword, @RequestParam(required = false, defaultValue = "0") int page) {
		if (keyword != null && !keyword.trim().isEmpty()) {
			return projectService.find(keyword, page, 8);
		} else {
			return projectService.listRecent(page, 8);
		}
	}

	@ApiOperation(value = "创建项目")
	@RequestMapping(value = "", method = RequestMethod.POST)
	public Result<Project> create(@RequestBody Project project) {
		Project newProject = projectService.create(project);
		return new Result<>(true, null, newProject);
	}

	@ApiOperation(value = "修改项目data, 该项目必须是自己的项目")
	@RequestMapping(value = "/{id}/data", method = RequestMethod.PUT)
	public Result<Boolean> setMyProjectData(@PathVariable int id, @RequestBody Project project) {
		boolean successed = projectService.setUserProjectData(id, project.getData());
		return new Result<>(true, null, successed);
	}

	@ApiOperation(value = "修改项目信息, 该项目必须是自己的项目")
	@RequestMapping(value = "/{id}/info", method = RequestMethod.PUT)
	public Result<Boolean> updateMyProject(@PathVariable int id, @RequestBody Project project) {
		project.setId(id);
		boolean successed = projectService.updateUserProject(project);
		return new Result<>(true, null, successed);
	}

	@WithoutLogin
	@ApiOperation(value = "获取单个项目信息")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Project getById(@PathVariable int id) {
		return projectService.getById(id);
	}

	@ApiOperation(value = "我的项目列表")
	@RequestMapping(value = "/my/", method = RequestMethod.GET)
	public Pager<Project> myProjects(@RequestParam(required = false, defaultValue = "0") int page) {
		return projectService.myProject(page, 8);
	}

	@WithoutLogin
	@ApiOperation(value = "访问次数inc")
	@RequestMapping(value = "/{id}/open/inc", method = RequestMethod.PUT)
	public Result<Objects> incOpen(@PathVariable int id) {
		projectService.incOpen(id);
		return new Result<>(true, null, null);
	}

	@WithoutLogin
	@ApiOperation(value = "open projct")
	@RequestMapping(value = "/open", method = RequestMethod.GET)
	public Result<Project> getOpenedProject(@CookieValue(value = "open-id", required = false) Integer id) {
		if (id == null) {
			return new Result<>(true, null, null);
		} else {
			Project project = projectService.getById(id);
			return new Result<>(true, null, project);
		}
	}

	@WithoutLogin
	@ApiOperation(value = "openning projct")
	@RequestMapping(value = "/openning", method = RequestMethod.PUT)
	public Result<Boolean> openning(Integer id, HttpServletResponse response) {
		Cookie c1 = new Cookie("open-id", String.valueOf(id));
		c1.setPath("/");
		response.addCookie(c1);
		return new Result<>(true, null, true);
	}

	@ApiOperation(value = "删除自己的项目")
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public Result<Boolean> delete(@PathVariable Integer id) {
		Boolean result = projectService.delete(id);
		return new Result<>(true, null, result);
	}


}
