package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 5000, size = 1000, readWrite = false)
public interface ProjectMapper {

	@Select("select project.id from project where privately=false")
	List<Project> projects();

	@Insert("insert into project(createTime, modifyTime, name, siteURL, siteTitle, privately) values(#{project.createTime}, #{project.modifyTime}, #{project.name}, #{project.siteURL}, #{project.siteTitle}, #{project.privately})")
	@Options(useGeneratedKeys = true, keyProperty = "project.id")
	void create(@Param("project")Project project);

	@Select("select * from project where id=#{id}")
	Project getById(@Param("id") int id);
}
