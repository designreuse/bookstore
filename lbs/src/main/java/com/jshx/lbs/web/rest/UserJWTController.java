package com.jshx.lbs.web.rest;

import com.jshx.lbs.repository.UserRepository;
import com.jshx.lbs.security.jwt.JWTConfigurer;
import com.jshx.lbs.security.jwt.TokenProvider;
import com.jshx.lbs.web.rest.vm.LoginVM;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final Logger log = LoggerFactory.getLogger(UserJWTController.class);

    private final TokenProvider tokenProvider;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    public UserJWTController(UserRepository userRepository,TokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/authenticate")
    @Timed
    public ResponseEntity authorize(@Valid @RequestBody LoginVM loginVM, HttpServletResponse response) {

        //分割@
        String companyId = "";
        String[] userComInfo = loginVM.getUsername().trim().split("@");
        String userName = userComInfo[0];
        String companyName =userComInfo[1];
        loginVM.setUsername(userName);
        Map<String,Object> map = new HashMap<String,Object>();
        //查询companyid
        List<String> companyIdList = userRepository.getCompanyId(companyName);
        if(null != companyIdList && companyIdList.size() > 0 )
        {
            companyId = companyIdList.get(0);

        }
        map.put("companyId",companyId);

        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername(), loginVM.getPassword());
        authenticationToken.setDetails(map);
        try {
            //springSecurity鉴权
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            Map map1 = (Map) authentication.getDetails();
            String comp =(String) map1.get("companyId");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
            String jwt = tokenProvider.createToken(authentication, rememberMe,companyId);
            response.addHeader(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);
//            response.setHeader("Access-Control-Allow-Origin", "*");
//            response.setHeader("Access-Control-Allow-Methods","POST");
//            response.setHeader("Access-Control-Allow-Headers","x-requested-with,content-type");
            return ResponseEntity.ok(new JWTToken(jwt));
        } catch (AuthenticationException ae) {
            log.trace("Authentication exception trace: {}", ae);
            return new ResponseEntity<>(Collections.singletonMap("AuthenticationException",
                ae.getLocalizedMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
