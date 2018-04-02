package com.jshx.lbs.security;

import com.jshx.lbs.domain.SysRole;
import com.jshx.lbs.domain.SysUser;
import com.jshx.lbs.repository.SysUserRepository;
import com.jshx.lbs.repository.UserRepository;
import com.jshx.lbs.service.mapper.UsersMapper;
import org.omg.CORBA.Object;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class LbsSysUserDetailsService implements LoginUserDetailsService {

    private final Logger log = LoggerFactory.getLogger(LbsSysUserDetailsService.class);

    private final SysUserRepository sySuserRepository;

    public LbsSysUserDetailsService(SysUserRepository sySuserRepository) {
        this.sySuserRepository = sySuserRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login,final String companyId) {
        log.debug("Authenticating {}", login);
        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);

         Optional<SysUser> userFromDatabase = sySuserRepository.findByUserNameAndCompanyId(lowercaseLogin, companyId);
        return userFromDatabase.map(user -> {
//            if (!user.getActivated()) {
//                throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
//            }

            //将用户权限赋予spring自带的用户中去，进行验证
            List<GrantedAuthority> grantedAuthorities=new ArrayList<>();
            //获取用户的角色
            List<SysRole> sysRoles = new ArrayList<>(user.getSysRoles());
            //获取用户的角色下的权限
            for(SysRole s:sysRoles)
            {
                List<GrantedAuthority> roleAuthorities=s.getSysPrivileges().stream()
                    .map(sysPrivileges -> new SimpleGrantedAuthority(sysPrivileges.getPrivilegeName()))
                    .collect(Collectors.toList());
                grantedAuthorities.addAll(roleAuthorities);
            }
            grantedAuthorities.add( new SimpleGrantedAuthority("userId-"+user.getId()));
//            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//            grantedAuthorities.add(new SimpleGrantedAuthority("用户管理"));

//            }

            return new org.springframework.security.core.userdetails.User(lowercaseLogin,
                user.getUserPwd(),
                grantedAuthorities);

        }).orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseLogin + " was not found in the " +
        "database"));
    }
}
