package com.jshx.lbs.service;
import com.jshx.lbs.domain.BaseReturnMessage;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SysPrivilegelbsService {
    public List<Map> getPrivilegeInfo();
    public BaseReturnMessage savePrivilege(String privilegename,String privilegedesc,String privilegepid,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delPrivilege(String privilegeId,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updatePrivilege(String privilegeId,String privilegename,String privilegedesc,BaseReturnMessage baseReturnMessage);
}
