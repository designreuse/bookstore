package com.jshx.lbs.service.impl;

import com.jshx.lbs.service.UsersService;
import com.jshx.lbs.service.mapper.UsersMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service("usersService")
public class UsersServiceImpl implements UsersService{

    @Resource
    private UsersMapper usersMapper;

    @Override
    public Map CheckSuperMan(String userId) {
        List<Map>list =  usersMapper.CheckSuperMan(userId);
        if(list.size()>0){
            return list.get(0);
        }else{
            return null;
        }
    }

    @Override
    public Map getUserInfo(String userId) {
        List<Map>list =  usersMapper.getUserInfo(userId);
        if(list.size()>0){
            return list.get(0);
        }else{
            return null;
        }

    }

    @Override
    public Map getCompanyInfoByUser(String companyId) {
        List<Map>list =  usersMapper.getCompanyInfoByUser(companyId);
        if(list.size()>0){
            return list.get(0);
        }else{
            return null;
        }
    }
}
