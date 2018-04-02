package com.jshx.lbs.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;


public interface AlarmService {
    public  List<Map> getAlarmInfo(String carNo,int alarmType,List groupIdList,List keyIdList,String driverName,String alarmLevel,int alarmTreat,String startTime,String endTime,String userId,Map<String,Object>logParamMap);

    public  List<Map> getAlarmInfoByPage(String carNo,int alarmType,List keyIdList, String startTime,String endTime, int pageNum);

    public List getAlarmDataCount(String companyId, List<String> userGroupIdList, List<String> groupIdList,int alarmType,int DateType, String searchTime,int week,List keyIdList,String driverName);

    public List<String[]> getAlarmDataCountPicture(String companyId, List<String> userGroupIdList, List<String> groupIdList, int DateType, String searchTime,int week,List keyIdList,String driverName);

    public List<Map> getAlarmType(String companyId,String alarmType);

    public List<Map> getAlarmForDriver(String carNo, String driverName, int alarmTypeInt, String startTime, String endTime, String userId);
    public List<Map> searchAlarm(String userId,String companyId,int alarmType,List<Map> list,boolean flag);
    public List<Map> getAlarmEvaluation(String driverName,String companyId,List keyIdList,List groupIdList,String groupId,String time);
    public void dealAlarm(Map map);
    public String getLogContent(String companyId, String userName, String date, String carNo, int alarmType,List groupIdList,String driverName,String alarmLevel,int alarmTreat, String startTime, String endTime, int result,int ErrorType);
    public void saveAlarmLog(Map<String,Object>Param);
    public List<Map>searchAlarmLog(String userName,String startTime,String endTime);

    public Map getAlarmTreatInfoById(String id,String keyId,String alarmType,String alarmDate);

    public List<Map> getMediaJSONForType(String alarmNo,String fileType);
    public List<Map> getMediaIOForType(String alarmNo,String fileType);
    public byte[] getMediaIOForFileName(String fileName);
}
