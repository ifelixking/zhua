package com.felix.zhua.mapper;

import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface ProjectRatingMapperW {

	@Update("UPDATE rating SET `value`=`value`+1 WHERE target=#{id} AND type='project'")
	void inc(int id);

	@Update("UPDATE rating SET `value`=`value`-1 WHERE target=#{id} AND type='project'")
	void dec(int id);
}
