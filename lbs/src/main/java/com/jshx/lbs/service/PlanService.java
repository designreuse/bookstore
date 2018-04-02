package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface PlanService {
    public BaseReturnMessage savePlan(int commandId, String commandPara, String planName, String planTime,List keyIdList,String ip,BaseReturnMessage baseReturnMessage);
    public  void delPlan(List<String> idList);
    public  BaseReturnMessage updatePlan(String id,int commandId, String commandPara, String planName, String planTime,List keyIdList,String ip,BaseReturnMessage baseReturnMessage);
    public List<Map> searchPlan(String planId,String planName,String startTime,String endTime);
    public List getPlanInfoList(String pid);

}
