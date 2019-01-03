package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface ProjectMapper {
	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, rating.value AS rating " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id LEFT JOIN rating ON project.id=rating.target AND rating.type='project' " +
			"WHERE privately=FALSE ORDER BY project.modifyTime DESC LIMIT #{start}, #{count}")
	List<Project> listRecent(@Param("start") int start, @Param("count") int count);

	@Select("SELECT project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data, rating.value AS rating " +
			"FROM project LEFT JOIN user ON project.ownerId=user.id LEFT JOIN rating ON project.id=rating.target AND rating.type='project' " +
			"WHERE privately=FALSE ORDER BY rating.value DESC, project.modifyTime DESC LIMIT #{start}, #{count}")
	List<Project> listPopular(@Param("start") int start, @Param("count") int count);

	@Select("SELECT COUNT(*) FROM project WHERE privately=FALSE")
	int listCount();

//	@Select("select project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data " +
//			"from project left join user on project.ownerId=user.id " +
//			"where privately=false and (project.name like CONCAT('%',#{keyword},'%') or project.siteURL like CONCAT('%',#{keyword},'%')) " +
//			"ORDER BY rating.value DESC, project.modifyTime DESC LIMIT #{start}, #{count}")
//	List<Project> find(String keyword, int start, int count);
//
//	@Select("SELECT COUNT(*) FROM project WHERE privately=FALSE AND (project.name LIKE CONCAT('%',#{keyword},'%') OR project.siteURL LIKE CONCAT('%',#{keyword},'%')) ")
//	int findCount(String keyword);

	@Select("select project.id, project.ownerId, user.email as ownerEmail, project.createTime, project.modifyTime, project.name, project.siteURL, project.siteTitle, project.privately, project.data " +
			"from project left join user on project.ownerId=user.id " +
			"WHERE privately=false AND project.id = #{id}")
	Project getById4List(@Param("id") int id);
}
