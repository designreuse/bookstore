package com.jshx.lbs.security;

import com.jshx.lbs.domain.SysPrivilege;
import com.jshx.lbs.repository.SysPrivilegeRepository;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Component("securityMetadataSource")
public class LbsInvocationSecurityMetadataSourceService implements FilterInvocationSecurityMetadataSource {


    private final SysPrivilegeRepository sysPrivilegeRepository;

    private HashMap<String, Collection<ConfigAttribute>> map =null;

    public LbsInvocationSecurityMetadataSourceService(SysPrivilegeRepository sysPrivilegeRepository) {
        this.sysPrivilegeRepository = sysPrivilegeRepository;
    }
    /**
     * 加载权限表中所有权限
     */
    public void loadResourceDefine(){
        map = new HashMap<>();
        Collection<ConfigAttribute> array;
        ConfigAttribute cfg;
        List<SysPrivilege> permissions = sysPrivilegeRepository.findAll();
        for(SysPrivilege permission : permissions) {
            array = new ArrayList<>();
            cfg = new SecurityConfig(permission.getPrivilegeName());
            //此处只添加了用户的名字，其实还可以添加更多权限的信息，例如请求方法到ConfigAttribute的集合中去。此处添加的信息将会作为MyAccessDecisionManager类的decide的第三个参数。
            //实际项目中需要从数据库中根据角色获取权限进行保存
            array.add(cfg);
            //用权限的getUrl() 作为map的key，用ConfigAttribute的集合作为 value，
            if(permission.getPriviligeDesc() == null || permission.getPriviligeDesc() == "")
            {

            }else
            {
                map.put(permission.getPriviligeDesc(), array);
            }
        }

    }

    //此方法是为了判定用户请求的url 是否在权限表中，如果在权限表中，则返回给 decide 方法，用来判定用户是否有此权限。如果不在权限表中则放行。
    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        if(map ==null) loadResourceDefine();
        //object 中包含用户请求的request 信息
        HttpServletRequest request = ((FilterInvocation) object).getHttpRequest();
        AntPathRequestMatcher matcher;
        String resUrl;
        for(Iterator<String> iter = map.keySet().iterator(); iter.hasNext(); ) {
            resUrl = iter.next();
            matcher = new AntPathRequestMatcher(resUrl);
            if(matcher.matches(request)) {
                return map.get(resUrl);
            }
        }
        return null;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}
