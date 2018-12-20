package com.felix.zhua.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter
public class TestFilter implements Filter {
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		System.out.println("test filter init");
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		System.out.println("test filter dofilter");
		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void destroy() {
		System.out.println("test filter destroy");
	}
}
