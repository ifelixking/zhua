package com.felix.zhua.mapper;

import com.felix.zhua.model.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@CacheNamespace(flushInterval = 5000, size = 1000, readWrite = false)
public interface UserMapper {

	@Select("select * from user")
	List<User> users();

	@Select("select * from user where email=#{username} and pwd=md5(#{password})")
	User getUserByUsernamePassword(@Param("username") String username, @Param("password") String password);

	@Select("insert into user(email, password) values(#{username}, md5(#{password}))")
	void add(String username, String password);

	@Select("SELECT COUNT(*) FROM user WHERE email=#{email}")
	int countByEmail(String email);
}