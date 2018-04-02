package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface SysUserService {
    public BaseReturnMessage setUserCars(String userId, List carIdList, BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage setUserLevel(String userId,String level,BaseReturnMessage baseReturnMessage);
    public  List<Map>  getUserCars();


    public  List<Map> getUserInfo();
    public  List<Map> queryUserInfo(String username);
    public  List<Map>  getUserRoles(String userId);
    public BaseReturnMessage setUserRole(String userId, List roleIdList, BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage saveUser(String username,String userpass,String userdesc,String realname, String groupid,
                                      String userphone,String email,String userlevel,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delUser(String userId,BaseReturnMessage baseReturnMessage);
    public  List<Map>  getSingleUser(String userId);
    public BaseReturnMessage updateUser(String userId,String username,String userdesc,String realname, String groupid, String userphone,String email,String userlevel,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updateUserPass(String userId,String userpass,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage setUserLock(String userId,String userstatus,BaseReturnMessage baseReturnMessage);

}
