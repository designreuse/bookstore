package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import com.jshx.lbs.web.rest.util.MD5Util;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jshx.lbs.service.SysUserService;
import com.jshx.lbs.service.mapper.SysUserMapper;
import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Transactional
@Service("SysUserService")

public class SysUserServiceImpl  implements SysUserService{
    @Resource
    private SysUserMapper sysUserMapper;

    @Override
    public BaseReturnMessage setUserCars(String userId, List carIdList, BaseReturnMessage baseReturnMessage) {

        List<Map> resultMap = sysUserMapper.queryUserCars(userId);//需要设置的用户ID
        if(resultMap.size() !=0 )
        {
            sysUserMapper.delUserCars(userId);
        }
        for(Object carid :carIdList)
        {
            Map<String,Object>paramMap = new HashMap<String,Object>();
            paramMap.put("userid",userId);
            paramMap.put("carid",carid.toString());
            sysUserMapper.setUserCar(paramMap);
        }
        baseReturnMessage.setMessage("用户车辆设置成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage setUserLevel(String userId, String level, BaseReturnMessage baseReturnMessage) {

        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("user_id",userId);
        paramMap.put("user_level",level);
        sysUserMapper.setUserLevel(paramMap);
        baseReturnMessage.setMessage("设置用户分级成功");
        return baseReturnMessage;
    }

    @Override
    public List<Map> getUserCars() {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();

        return  sysUserMapper.getUserCars(companyId);

    }

    @Override
    public List<Map> getUserInfo() {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        return sysUserMapper.getUserInfo(companyId,userId);
    }

    @Override
    public List<Map> queryUserInfo(String username) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        return sysUserMapper.queryUserInfo(companyId,userId,username);
    }

    @Override
    public List<Map> getUserRoles(String userId) {
        return sysUserMapper.getUserRoles(userId);
    }

    @Override
    public BaseReturnMessage setUserRole(String userId, List roleIdList, BaseReturnMessage baseReturnMessage) {
        sysUserMapper.delUserRole(userId);
        for(Object roleId :roleIdList)
        {
            Map<String,Object>paramMap = new HashMap<String,Object>();
            paramMap.put("userid",userId);
            paramMap.put("roleId",roleId.toString());
            sysUserMapper.setUserRole(paramMap);
        }
        baseReturnMessage.setMessage("用户角色设置成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage saveUser(String username, String userpass, String userdesc, String realname, String groupid, String userphone,
                                      String email,String userlevel, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(username)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("用户名称为空");
        }
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> userRepeat = sysUserMapper.queryRepeatUserInfo(companyId,username);
        if(userRepeat!=null && userRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该用户名称已存在");
        }
        //正则规则---校验用户密码
        Pattern pattern = Pattern.compile("^(?=.*[a-zA-Z])(?=.*[0-9])(?=([\\x21-\\x7e]+)[^a-zA-Z0-9]).{8,20}$");
        Matcher match = pattern.matcher(userpass);
        if(!match.matches())
        {
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("您所填的新密码必须至少包含一个字母、数字、特殊符号并且长度在8位以上");
        }

        MD5Util md5 = new MD5Util();
        Map<String,Object>paramMap = new HashMap<String,Object>();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("userid",uuid);
        paramMap.put("companyId",companyId);
        paramMap.put("username",username);
        paramMap.put("userpass",md5.getMD5ofStr(userpass).toLowerCase());
        paramMap.put("userdesc",userdesc);

        paramMap.put("realname",realname);
        paramMap.put("groupid",groupid);
        paramMap.put("userphone",userphone);
        paramMap.put("email",email);
        paramMap.put("userlevel",userlevel);

        sysUserMapper.saveUser(paramMap);
        baseReturnMessage.setMessage("新增用户成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage delUser(String userId, BaseReturnMessage baseReturnMessage) {
        //超级管理员不允许被删除
        List<Map>list =  sysUserMapper.CheckSuperMan(userId);
        if(list.size()>0) {
            baseReturnMessage.setMessage("超级管理员不允许被删除");
            return baseReturnMessage;
        }
        sysUserMapper.delUserInfo(userId);
        sysUserMapper.delUserRole(userId);
        baseReturnMessage.setMessage("删除用户成功");
        return baseReturnMessage;
    }

    @Override
    public List<Map> getSingleUser(String userId) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> userList = sysUserMapper.getSingleUser(companyId,userId);
        return sysUserMapper.getSingleUser(companyId,userId);
    }

    @Override
    public BaseReturnMessage updateUser(String userId, String username,  String userdesc, String realname, String groupid, String userphone,
                                        String email,String userlevel, BaseReturnMessage baseReturnMessage) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> userRepeat = sysUserMapper.queryRepeatUpdUserInfo(companyId,userId,username);
        if(userRepeat!=null && userRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该用户名称已存在");
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("userid",userId);
        paramMap.put("username",username);
      //  paramMap.put("userpass",passwordEncoder.encode(userpass));
        paramMap.put("userdesc",userdesc);

        paramMap.put("realname",realname);
        paramMap.put("groupid",groupid);
        paramMap.put("userphone",userphone);
        paramMap.put("email",email);
        paramMap.put("userlevel",userlevel);

        sysUserMapper.saveUser(paramMap);
        baseReturnMessage.setMessage("修改用户成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updateUserPass(String userId, String userpass, BaseReturnMessage baseReturnMessage) {
        //正则规则---校验用户密码
        Pattern pattern = Pattern.compile("^(?=.*[a-zA-Z])(?=.*[0-9])(?=([\\x21-\\x7e]+)[^a-zA-Z0-9]).{8,20}$");
        Matcher match = pattern.matcher(userpass);
        if(!match.matches())
        {
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("您所填的新密码必须至少包含一个字母、数字、特殊符号并且长度在8位以上");
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        MD5Util md5 = new MD5Util();
        paramMap.put("userid",userId);
        paramMap.put("userpass",md5.getMD5ofStr(userpass).toLowerCase());
        sysUserMapper.updUserPass(paramMap);
        baseReturnMessage.setMessage("修改用户密码成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage setUserLock(String userId, String userstatus, BaseReturnMessage baseReturnMessage) {
        //超级管理员不允许设置锁
        List<Map>list =  sysUserMapper.CheckSuperMan(userId);
        if(list.size()>0) {
            baseReturnMessage.setMessage("超级管理员不允许设置锁");
            return baseReturnMessage;
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("userid",userId);
        paramMap.put("userstatus",userstatus);
        sysUserMapper.setUserLock(paramMap);
        baseReturnMessage.setMessage("用户设置锁成功");
        return baseReturnMessage;
    }
}
