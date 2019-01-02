package com.felix.zhua.mapper;

import com.felix.zhua.model.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface UserMapper {

	@Select("SELECT * FROM user")
	List<User> users();

	@Select("SELECT COUNT(*) FROM user WHERE email=#{email}")
	int countByEmail(String email);
}