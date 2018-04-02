package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface SysRoleMapper {
     List<Map> getRoleInfo(String companyId);
     List<Map> queryRolePri(String roleId);
     List<Map> queryAllCompanyPri(String companyId);
     List<Map> queryRepeatRoleInfo(String companyId,String rolename);
     List<Map> queryRepeatUpdRoleInfo(String companyId,String roleId,String rolename);
     int delRolePri(String  roleId);
     int setRolePri(Map map);
     int saveRole(Map map);
     int delRoleInfo(String  roleId);
     int updRoleInfo(Map map);
}
