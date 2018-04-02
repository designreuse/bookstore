package com.jshx.lbs.service;
import com.jshx.lbs.domain.BaseReturnMessage;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SysRoleLbsService {
    public  List<Map>  getRoleInfo();
    public  List<Map>  queryRolePri(String roleId);
    public  List<Map>  queryAllCompanyPri();
    public BaseReturnMessage setRolePri(String roleId,List priIdList,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage saveRole(String rolename,String roledesc,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delRole(String roleId,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updateRole(String roleId,String rolename,String roledesc,BaseReturnMessage baseReturnMessage);
}
