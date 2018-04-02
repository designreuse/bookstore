package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface SysUserMapper {
    List<Map> queryUserCars(String userid);
    int delUserCars(String  userid);
    int setUserCar(Map map);
    int setUserLevel(Map map);
    List<Map> getUserCars(String compamyId);
    List<Map> getUserRoles(String userid);
    List<Map> getUserInfo(String compamyId,String  userid);
    List<Map> queryUserInfo(String compamyId,String  userId,String username);
    List<Map> queryRepeatUserInfo(String compamyId,String username);
    List<Map> queryRepeatUpdUserInfo(String compamyId,String  userid,String username);
    int delUserRole(String  userid);
    int setUserRole(Map map);
    int saveUser(Map map);
    int delUserInfo(String  userid);
    List<Map> getSingleUser(String compamyId,String  userid);
    int updUserInfo(Map map);
    int updUserPass(Map map);
    List CheckSuperMan(String userid);
    int setUserLock(Map map);

}
