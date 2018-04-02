package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface MessageService {
    public void saveMsg(int commandId, String commandPara, List carNoList,String ip,BaseReturnMessage baseReturnMessage);
  //  public  int delMsg(List guidList);
    public void saveMsgInterval(String planId,List keyIdList,String ip);
    public void saveMsgInterval(Map paramMap,List keyIdList,String ip);
    public  int delMsg(String  pid);
    public List getMsgLog(String createUser,String startTime,String endTime,String commandId,String dealResult,String carNo,String softVesion,int deviceId,String productType);
    public String getCommandIdxStr();
}
