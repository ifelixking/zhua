package com.felix.zhua;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@MapperScan("com.felix.zhua.mapper")
@SpringBootApplication
@ServletComponentScan
public class Application {

	public static void main(String[] args) {
		System.setProperty("es.set.netty.runtime.available.processors", "false");
		SpringApplication.run(Application.class, args);
	}

}

