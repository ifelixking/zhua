package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 5000, size = 1000, readWrite = false)
public interface ProjectMapper {

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id " +
			"where privately=false order by project.modifyTime desc limit #{start}, #{count}")
	List<Project> list(@Param("start") int start, @Param("count") int count);

	@Select("SELECT COUNT(*) FROM project WHERE privately=FALSE")
	int count();

	@Insert("insert into project(createTime, modifyTime, name, siteURL, siteTitle, privately, data, ownerId) " +
			"values(unix_timestamp(), unix_timestamp(), #{project.name}, #{project.siteURL}, #{project.siteTitle}, #{project.privately}, #{project.data}, #{project.ownerId})")
	@Options(useGeneratedKeys = true, keyProperty = "project.id")
	void create(@Param("project") Project project);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id WHERE project.id=#{id}")
	Project getById(@Param("id") int id);

	@Select("select project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data " +
			"from project left join user on project.ownerId=user.id " +
			"where privately=false and (project.name like CONCAT('%',#{keyword},'%') or project.siteURL like CONCAT('%',#{keyword},'%')) " +
			"order by project.modifyTime desc limit #{start}, #{count}")
	List<Project> find(String keyword, int start, int count);

	@Select("SELECT COUNT(*) FROM project " +
			"WHERE privately=FALSE AND (project.name LIKE CONCAT('%',#{keyword},'%') OR project.siteURL LIKE CONCAT('%',#{keyword},'%')) ")
	int findCount(String keyword);

	@Update("UPDATE project SET data=#{data} WHERE id=#{id}")
	boolean setData(int id, String data);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, project.privately " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id " +
			"where project.ownerId=#{userId} order by project.modifyTime desc")
	List<Project> getProjectsByOwnerId(@Param("userId") int userId);
}
