package com.felix.zhua;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@MapperScan("com.felix.zhua.mapper")
@SpringBootApplication
@ServletComponentScan
public class Application {

	public static void main(String[] args) {
		System.setProperty("es.set.netty.runtime.available.processors", "false");
		SpringApplication.run(Application.class, args);
	}

//	@Bean
//	public CookieSerializer httpSessionIdResolver(){
//		DefaultCookieSerializer cookieSerializer = new DefaultCookieSerializer();
//		cookieSerializer.setCookieName("token");
//		cookieSerializer.setUseHttpOnlyCookie(false);
//		cookieSerializer.setSameSite(null);
//		cookieSerializer.setDomainName("www.zhua.com");
//		return cookieSerializer;
//	}
}

