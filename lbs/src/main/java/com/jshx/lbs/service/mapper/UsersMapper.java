package com.jshx.lbs.service.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface UsersMapper {
    List CheckSuperMan(String userId);
    List<Map> getUserInfo(String userId);
    List<Map> getCompanyInfoByUser(String companyId);
}
