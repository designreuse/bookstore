package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.MessageService;
import com.jshx.lbs.service.PlanService;
import com.jshx.lbs.service.mapper.MessageMapper;
import com.jshx.lbs.service.mapper.PlanMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
@Transactional
@Service("PlanService")
public class PlanServiceImpl implements PlanService {

    @Resource
    private PlanMapper planMapper;

    @Resource
    private MessageService messageService;

    @Override
    public BaseReturnMessage savePlan(int commandId,String commandPara,String planName,String planTime,List keyIdList,String ip,BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(planName)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("策略名称为空");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Map<String,Object>paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        Date createdon = new Date();
        String userId = mapDetail.get("userId").toString();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("commandId",commandId);
        paramMap.put("commandPara",commandPara);
        paramMap.put("planName",planName);
        try {
            paramMap.put("planTime",sdf.parse(planTime));
        } catch (ParseException e) {
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("定时时间格式有误");
            e.printStackTrace();
        }
        paramMap.put("createdon",createdon);
        paramMap.put("userId",userId);
        paramMap.put("id",uuid);
        planMapper.savePlan(paramMap);
        messageService.saveMsgInterval(paramMap,keyIdList,ip);
        baseReturnMessage.setMessage("新增策略成功");
        return baseReturnMessage;
    }

    @Override
    public void delPlan(List<String> idList) {
        for(String id:idList){
            messageService.delMsg( id);
            planMapper.delPlan(id);
        }
    }

    @Override
    public BaseReturnMessage updatePlan(String id, int commandId, String commandPara, String planName, String planTime,List keyIdList,String ip, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(planName)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("策略名称为空");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Map<String,Object>paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        Date modifiedon = new Date();
        String userId = mapDetail.get("userId").toString();
        paramMap.put("id",id);
        paramMap.put("commandId",commandId);
        paramMap.put("commandPara",commandPara);
        paramMap.put("planName",planName);
        try {
            paramMap.put("planTime",sdf.parse(planTime));
        } catch (ParseException e) {
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("定时时间格式有误");
            e.printStackTrace();
        }
        paramMap.put("modifiedon",modifiedon);
        paramMap.put("userId",userId);
        planMapper.updatePlan(paramMap);
        messageService.delMsg(id);
        if(keyIdList!=null && keyIdList.size()>0) {
            messageService.saveMsgInterval(paramMap, keyIdList, ip);
        }
        return baseReturnMessage;
    }

    @Override
    public List<Map> searchPlan(String planId, String planName, String startTime, String endTime) {
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("planId",planId);
        paramMap.put("planName",planName);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        List<Map> planList = planMapper.searchPlan(paramMap);
        if(planList!=null && planList.size()>0) {
            for (Map<String, Object> map : planList) {
                map.put("COMMAND_ID_STR", "");
                if (map.get("COMMAND_ID") != null && StringUtils.isNotBlank(map.get("COMMAND_ID").toString())) {
                    map.put("COMMAND_ID_STR", Constants.MSG_UPDATE_MAP.get(Integer.parseInt(map.get("COMMAND_ID").toString())));
                }
            }
        }
        return planList;
    }

    @Override
    public List getPlanInfoList(String pid) {
        List<Map<String,Object>>list = planMapper.getPlanInfoList(pid);
        if(list!=null &&list.size()>0) {
            for (Map<String, Object> map : list) {
                map.put("DEVICE_ID_STR", "");
                if (map.get("DEVICE_ID")!=null && StringUtils.isNotBlank(Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()))) {
                    map.put("DEVICE_ID_STR", Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()));
                }
            }
        }
        return list;
    }
}
