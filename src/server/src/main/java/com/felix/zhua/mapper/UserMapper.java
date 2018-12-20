package com.felix.zhua.mapper;

import com.felix.zhua.model.User;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 5000, size = 1000, readWrite = false)
public interface UserMapper {

	@Select("select * from user")
	List<User> users();
}
