package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysPrivilegeService;
import com.jshx.lbs.service.mapper.SysPrivilegeMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class SysPrivilegeImpl implements SysPrivilegeService {
    @Resource
    private SysPrivilegeMapper sysPrivilegeMapper;
    @Override
    public List<Map> getPrivilegeInfo() {
        return sysPrivilegeMapper.getPrivilegeInfo();
    }

    @Override
    public BaseReturnMessage savePrivilege(String privilegename, String privilegedesc, String privilegepid, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(privilegename)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("权限名称为空");
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("privilege_id",uuid);
        paramMap.put("privilege_name",privilegename);
        paramMap.put("privilige_desc",privilegedesc);
        paramMap.put("privilege_pid",privilegepid);
        sysPrivilegeMapper.savePrivilege(paramMap);
        baseReturnMessage.setMessage("新增权限成功");
        return baseReturnMessage;
    }


    @Override
    public BaseReturnMessage delPrivilege(String privilegeId, BaseReturnMessage baseReturnMessage) {
        sysPrivilegeMapper.delPrivilegeInfo(privilegeId);
        baseReturnMessage.setMessage("删除权限成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updatePrivilege(String privilegeId, String privilegename, String privilegedesc, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(privilegename)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("权限名称为空");
        }
        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("privilege_id",privilegeId);
        paramMap.put("privilege_name",privilegename);
        paramMap.put("privilige_desc",privilegedesc);
        sysPrivilegeMapper.updPrivilegeInfo(paramMap);
        baseReturnMessage.setMessage("修改权限成功");
        return baseReturnMessage;
    }


}
