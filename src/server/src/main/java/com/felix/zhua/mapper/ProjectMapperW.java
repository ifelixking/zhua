package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface ProjectMapperW {
	@Insert("insert into project(createTime, modifyTime, name, siteURL, siteTitle, privately, data, ownerId) " +
			"values(unix_timestamp(), unix_timestamp(), #{project.name}, #{project.siteURL}, #{project.siteTitle}, #{project.privately}, #{project.data}, #{project.ownerId})")
	@Options(useGeneratedKeys = true, keyProperty = "project.id")
	void create(@Param("project") Project project);

	@Update("UPDATE project SET data=#{data}, modifyTime=unix_timestamp() WHERE id=#{projectId} AND ownerId=#{userId}")
	boolean setUserProjectData(@Param("userId") int userId, @Param("projectId") int projectId, @Param("data") String data);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, rating.value AS rating " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id LEFT JOIN rating ON project.id=rating.target AND rating.type='project-open' WHERE project.id=#{id}")
	Project getById(@Param("id") int id);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, project.privately " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id " +
			"where project.ownerId=#{userId} order by project.modifyTime desc LIMIT #{start}, #{count}")
	List<Project> getProjectsByOwnerId(@Param("userId") int userId, @Param("start") int start, @Param("count") int count);

	@Select("SELECT COUNT(*) FROM project WHERE project.ownerId=#{userId}")
	int listCountByOwnerId(@Param("userId") int userId);
}
