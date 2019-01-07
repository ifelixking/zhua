package com.felix.zhua.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter
public class TestFilter implements Filter {
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// System.out.println("test filter init");
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		// System.out.println("test filter dofilter");
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		String curOrigin = request.getHeader("Origin");

		response.setHeader("Access-Control-Allow-Origin", curOrigin);
		response.setHeader("Access-Control-Allow-Credentials", "true");
		response.setHeader("Access-Control-Allow-Methods", "HEAD, POST, GET, PUT, OPTIONS, DELETE");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void destroy() {
		// System.out.println("test filter destroy");
	}
}
