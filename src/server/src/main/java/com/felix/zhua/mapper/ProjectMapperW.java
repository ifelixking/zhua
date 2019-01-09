package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface ProjectMapperW {
	@Insert("INSERT INTO project(createTime, modifyTime, name, siteURL, siteTitle, privately, data, ownerId) " +
			"VALUES(UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), #{project.name}, #{project.siteURL}, #{project.siteTitle}, #{project.privately}, #{project.data}, #{project.ownerId})")
	@Options(useGeneratedKeys = true, keyProperty = "project.id")
	void create(@Param("project") Project project);

	@Update("UPDATE project SET data=#{data}, modifyTime=UNIX_TIMESTAMP() WHERE id=#{projectId} AND ownerId=#{userId}")
	boolean setUserProjectData(@Param("userId") int userId, @Param("projectId") int projectId, @Param("data") String data);

	@Update("UPDATE project SET name=#{project.name}, siteURL=#{project.siteURL}, siteTitle=#{project.siteTitle}, modifyTime=UNIX_TIMESTAMP() WHERE id=#{project.id} AND ownerId=#{userId}")
	boolean updateUserProject(@Param("userId") int userId, @Param("project") Project project);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, rating.value AS rating " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id LEFT JOIN rating ON project.id=rating.target AND rating.type='project-open' WHERE project.id=#{id} AND project.isDelete=0")
	Project getById(@Param("id") int id);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, project.privately " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id " +
			"WHERE project.ownerId=#{userId} AND project.isDelete=0 ORDER BY project.modifyTime DESC LIMIT #{start}, #{count}")
	List<Project> getProjectsByOwnerId(@Param("userId") int userId, @Param("start") int start, @Param("count") int count);

	@Select("SELECT COUNT(*) FROM project WHERE ownerId=#{userId} AND isDelete=0")
	int listCountByOwnerId(@Param("userId") int userId);

	@Delete("UPDATE project SET isDelete=1, deleteTime=UNIX_TIMESTAMP() WHERE id=#{projectId} AND ownerId=#{userId}")
	boolean deleteUserProject(@Param("userId") int userId, @Param("projectId") int projectId);
}
