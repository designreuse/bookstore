package com.jshx.lbs.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface LoginUserDetailsService   {
    UserDetails loadUserByUsername(String username,String companyId) throws UsernameNotFoundException;
}
