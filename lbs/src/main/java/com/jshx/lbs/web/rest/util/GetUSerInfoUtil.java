package com.jshx.lbs.web.rest.util;

import com.jshx.lbs.security.SecurityUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.Map;
import java.util.Properties;

public class GetUSerInfoUtil {
    public static Map<String,Object> getUSerInfo(){
        Properties prop = new Properties();
        String signingKey = "";
        try{

            InputStream in = new BufferedInputStream(new FileInputStream(fileName));
            prop.load(in);
            signingKey = prop.getProperty("signingKey");
        }catch (Exception e){
            System.out.println(111);
//            signingKey = "my-secret-token-to-change-in-production";
        }
//        if(StringUtils.isBlank(signingKey)){
//            signingKey = "my-secret-token-to-change-in-production";
//        }
        String jwt = SecurityUtils.getCurrentUserJWT();
        Claims claims= Jwts.parser().setSigningKey(signingKey).parseClaimsJws(jwt).getBody();
        Map<String,Object> userData = (Map<String,Object>) claims.get("userData");
        return userData;
    }

    private static String fileName =
        GetUSerInfoUtil.class.getClassLoader().getResource("config/prop.properties").getPath();



    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
