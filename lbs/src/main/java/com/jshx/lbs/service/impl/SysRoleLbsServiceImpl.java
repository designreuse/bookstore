package com.jshx.lbs.service.impl;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysRoleLbsService;
import com.jshx.lbs.service.mapper.SysRoleMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

@Transactional
@Service("SysRoleLbsService")
public class SysRoleLbsServiceImpl implements SysRoleLbsService {

    @Resource
    private SysRoleMapper sysRoleMapper;
    @Override
    public List<Map> getRoleInfo() {
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        //角色数据信息
        List<Map> resultMap = sysRoleMapper.getRoleInfo(companyId);

        return resultMap;
    }

    @Override
    public List<Map> queryRolePri(String roleId) {
        List<Map> resultMap = sysRoleMapper.queryRolePri(roleId);
        return resultMap;
    }

    @Override
    public List<Map> queryAllCompanyPri() {
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        //角色数据信息
        List<Map> resultMap = sysRoleMapper.queryAllCompanyPri(companyId);

        return resultMap;
    }

    @Override
    public BaseReturnMessage setRolePri(String roleId, List priIdList, BaseReturnMessage baseReturnMessage) {
        sysRoleMapper.delRolePri(roleId);
        for(Object priId :priIdList)
        {
            Map<String,Object>paramMap = new HashMap<String,Object>();
            paramMap.put("roleId",roleId);
            paramMap.put("priId",priId.toString());
            sysRoleMapper.setRolePri(paramMap);
        }
        baseReturnMessage.setMessage("角色设置成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage saveRole(String rolename, String roledesc, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(rolename)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("角色名称为空");
        }

        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> roleRepeat = sysRoleMapper.queryRepeatRoleInfo(companyId,rolename);
        if(roleRepeat!=null && roleRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("当前公司下该角色名称已存在");
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("roleId",uuid);
        paramMap.put("rolename",rolename);
        paramMap.put("roledesc",roledesc);
        paramMap.put("companyId",companyId);
        sysRoleMapper.saveRole(paramMap);
        baseReturnMessage.setMessage("新增角色成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage delRole(String roleId, BaseReturnMessage baseReturnMessage) {
        sysRoleMapper.delRoleInfo(roleId);
        baseReturnMessage.setMessage("删除角色成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updateRole(String roleId, String rolename, String roledesc, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(rolename)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("角色名称为空");
        }
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> roleRepeat = sysRoleMapper.queryRepeatUpdRoleInfo(companyId,roleId,rolename);
        if(roleRepeat!=null && roleRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("当前公司下该角色名称已存在");
        }
        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("roleId",roleId);
        paramMap.put("rolename",rolename);
        paramMap.put("roledesc",roledesc);
        sysRoleMapper.updRoleInfo(paramMap);
        baseReturnMessage.setMessage("修改角色成功");
        return baseReturnMessage;
    }


}
