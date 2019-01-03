package com.felix.zhua.mapper;

import com.felix.zhua.model.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

@Repository
@CacheNamespace(flushInterval = 20000, size = 1000, readWrite = false)
public interface UserMapperW {
	@Select("SELECT * FROM user WHERE email=#{username} AND pwd=MD5(#{password})")
	User getUserByUsernamePassword(@Param("username") String username, @Param("password") String password);

	@Insert("INSERT INTO user(email, pwd) VALUES(#{username}, md5(#{password}))")
	void add(@Param("username") String username, @Param("password") String password);

	@Update("UPDATE user SET pwd=MD5(#{newPassword}) WHERE id=#{id} AND pwd=MD5(#{oldPassword})")
	int setPassword(int id, String oldPassword, String newPassword);
}
