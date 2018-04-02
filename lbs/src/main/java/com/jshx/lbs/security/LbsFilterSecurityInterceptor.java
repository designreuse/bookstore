package com.jshx.lbs.security;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.access.intercept.InterceptorStatusToken;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

import javax.annotation.Resource;
import javax.servlet.*;
import java.io.IOException;

public class LbsFilterSecurityInterceptor extends FilterSecurityInterceptor implements Filter {

    @Resource
    private LbsInvocationSecurityMetadataSourceService securityMetadataSource;

    public LbsFilterSecurityInterceptor(LbsInvocationSecurityMetadataSourceService securityMetadataSource,AccessDecisionManager accessDecisionManager)
    {
        super.setSecurityMetadataSource(securityMetadataSource);
        super.setAccessDecisionManager(accessDecisionManager);
        this.securityMetadataSource=securityMetadataSource;
    }
    @Override
    public void setAccessDecisionManager(AccessDecisionManager accessDecisionManager) {
        super.setAccessDecisionManager(accessDecisionManager);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        FilterInvocation fi = new FilterInvocation(request, response, chain);
        invoke(fi);
    }


    public void invoke(FilterInvocation fi) throws IOException, ServletException {
//fi里面有一个被拦截的url
//里面调用LbsInvocationSecurityMetadataSource的getAttributes(Object object)这个方法获取fi对应的所有权限
//再调用LbsAccessDecisionManager的decide方法来校验用户的权限是否足够
        InterceptorStatusToken token = super.beforeInvocation(fi);
        try {
//执行下一个拦截器
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } finally {
            super.afterInvocation(token, null);
        }
    }

    @Override
    public void destroy() {

    }

    @Override
    public SecurityMetadataSource obtainSecurityMetadataSource() {
        return this.securityMetadataSource;
    }


    public FilterInvocationSecurityMetadataSource getSecurityMetadataSource() {
        return this.securityMetadataSource;
    }

    @Override
    public Class<?> getSecureObjectClass() {
        return FilterInvocation.class;
    }

}
