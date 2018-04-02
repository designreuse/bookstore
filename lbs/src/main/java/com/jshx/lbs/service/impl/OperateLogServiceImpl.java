package com.jshx.lbs.service.impl;

import com.jshx.lbs.service.OperateLogService;
import com.jshx.lbs.service.mapper.OperateLogMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service("operateLogService")
public class OperateLogServiceImpl implements OperateLogService{
    @Resource
    private OperateLogMapper operateLogMapper;
    @Override
    public List<Map> getOperateType() {
        return operateLogMapper.getOperateType();
    }

    @Override
    public List<Map> searchOperateLog(String userName, String opetype, String startTime, String endTime) {
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("username",userName);
        paramMap.put("logetype",opetype);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("COMPANY_ID",companyId);
        List<Map> operateLogList = operateLogMapper.searchOperateLog(paramMap);
        return operateLogList;
    }

    @Override
    public List<Map> searchOperateLogSum(String userName, String opetype, String startTime, String endTime) {
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("username",userName);
        paramMap.put("logetype",opetype);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("COMPANY_ID",companyId);
        List<Map> operateLogList = operateLogMapper.searchOperateLogSum(paramMap);
        return operateLogList;
    }

    @Override
    public List<Map> searchLoginLog(String userName, String opetype, String startTime, String endTime) {
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("username",userName);
        paramMap.put("logetype",opetype);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("COMPANY_ID",companyId);
        List<Map> operateLogList = operateLogMapper.searchLoginLog(paramMap);
        return operateLogList;
    }
}
