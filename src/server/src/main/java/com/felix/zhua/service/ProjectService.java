package com.felix.zhua.service;

import com.felix.zhua.mapper.ProjectMapper;
import com.felix.zhua.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
	@Autowired
	ProjectMapper projectMapper;

	public List<Project> projects(){
		return projectMapper.projects();
	}

	public int create(Project project){
		projectMapper.create(project);
		return project.getId();
	}

	public Project getById(int id){
		return projectMapper.getById(id);
	}
}