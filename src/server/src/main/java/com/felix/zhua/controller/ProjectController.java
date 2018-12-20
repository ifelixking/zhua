package com.felix.zhua.controller;

import com.felix.zhua.model.Project;
import com.felix.zhua.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("project")
public class ProjectController {

	@Autowired
	ProjectService projectService;

	@RequestMapping("")
	public List<Project> projects(){
		return projectService.projects();
	}
}
