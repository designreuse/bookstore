package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.AlarmService;
import com.jshx.lbs.service.UsersService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AlarmInfoResource {

    private final Logger log = LoggerFactory.getLogger(AlarmInfoResource.class);

    @Resource
    private AlarmService alarmService;

    @Resource
    private UsersService usersService;

    @PostMapping("/getAlarmInfo")
    @Timed
    @ResponseBody
    public List getAlarmInfo(HttpServletRequest request,
                             @RequestParam(value = "carNo", required = false) String carNo,
                             @RequestParam(value = "alarmType", required = false) String alarmType,
                             @RequestParam(value = "groupIdList", required = false) List groupIdList,
                             @RequestParam(value = "keyIdList", required = false) List keyIdList,
                             @RequestParam(value = "driverName", required = false) String driverName,
                             @RequestParam(value = "alarmLevel", required = false) String alarmLevel,
                             @RequestParam(value = "alarmTreat", required = false) String alarmTreat,
                             @RequestParam(value = "startTime", required = false) String startTime,
                             @RequestParam(value = "endTime", required = false) String endTime)

    {
  //      long t1 =System.currentTimeMillis();
        int alarmTreatInt = -1;
        if(StringUtils.isNotBlank(alarmTreat)){
            alarmTreatInt = Integer.parseInt(alarmTreat);
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String customIP = GetUSerInfoUtil.getIpAddr(request);
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String date = sdf.format(new Date());
        String userId = mapDetail.get("userId").toString();
        String companyId = mapDetail.get("companyId").toString();
        String userName = usersService.getUserInfo(userId).get("USER_NAME").toString();
        Map<String,Object>logParamMap = new HashMap<String,Object>();
        String ID = UUID.randomUUID().toString();
        logParamMap.put("id",ID);
        logParamMap.put("date",date);
        logParamMap.put("userId",userId);
        logParamMap.put("userName",userName);
        logParamMap.put("customIP",customIP);
        logParamMap.put("carNo",carNo);
        logParamMap.put("alarmType",alarmType);
        logParamMap.put("startTime",startTime);
        logParamMap.put("endTime",endTime);
        int alarmTypeInt = -1;
        if (StringUtils.isNotBlank(alarmType)) {
            if ("-1".equals(alarmType)) {
                alarmTypeInt = Integer.parseInt(alarmType);
            } else if (!StringUtils.isNumeric(alarmType)) {
                log.error("alarmType参数有误");
                logParamMap.put("logContent",alarmService.getLogContent(companyId,userName,date,carNo,alarmTypeInt,groupIdList,driverName,alarmLevel,alarmTreatInt,startTime,endTime,0,Constants.AlarmTypeError));
                alarmService.saveAlarmLog(logParamMap);
                return null;
            } else {
                alarmTypeInt = Integer.parseInt(alarmType);
            }
        }
        if(StringUtils.isBlank(startTime)){
            logParamMap.put("logContent",alarmService.getLogContent(companyId,userName,date,carNo,alarmTypeInt,groupIdList,driverName,alarmLevel,alarmTreatInt,startTime,endTime,0,Constants.startTimeError));
            alarmService.saveAlarmLog(logParamMap);
            return null;
        } if(StringUtils.isBlank(endTime)){
            logParamMap.put("logContent",alarmService.getLogContent(companyId,userName,date,carNo,alarmTypeInt,groupIdList,driverName,alarmLevel,alarmTreatInt,startTime,endTime,0,Constants.endTimeError));
            alarmService.saveAlarmLog(logParamMap);
            return null;
        }
        List<Map> list = alarmService.getAlarmInfo(carNo, alarmTypeInt,groupIdList,keyIdList,driverName,alarmLevel,alarmTreatInt, startTime, endTime, userId,logParamMap);
//        long t2 =System.currentTimeMillis();
//        System.out.println("执行时间："+(t2-t1)/1000l);
        return list;
    }


    @PostMapping("/getAlarmInfoByPage")
    @Timed
    @ResponseBody
    //目前暂不使用该方法被getAlarmTreatInfoById替代
    public List getAlarmInfoByPage(
                             @RequestParam(value = "carNo", required = false) String carNo,
                             @RequestParam(value = "alarmType", required = false) int alarmType,
                             @RequestParam(value = "keyIdList", required = false) List keyIdList,
                             @RequestParam(value = "startTime", required = false) String startTime,
                             @RequestParam(value = "endTime", required = false) String endTime,
    @RequestParam(value = "pageNum", required = false) int pageNum)

    {

        List<Map> list = alarmService.getAlarmInfoByPage(carNo, alarmType,keyIdList, startTime, endTime,pageNum);
        return list;
    }


    @PostMapping("/getAlarmTreatInfoById")
    @Timed
    @ResponseBody
    public Map getAlarmTreatInfoById(HttpServletRequest request,
                             @RequestParam(value = "id", required = false) String alarmNo,
                             @RequestParam(value = "keyId", required = false) String keyId,
                             @RequestParam(value = "alarmType", required = false) String alarmType,
                             @RequestParam(value = "alarmDate", required = false) String alarmDate)

    {
        Map map = alarmService.getAlarmTreatInfoById(alarmNo,keyId,alarmType,alarmDate);
        return map;
    }


    @PostMapping("/getAlarmType")
    @Timed
    @ResponseBody
    public List getAlarmType( @RequestParam(value = "alarmType", required = false) String alarmType) {
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        return alarmService.getAlarmType(companyId,alarmType);
    }

    @PostMapping("/getDriverAlarmInfo")
    @Timed
    @ResponseBody
    public List getDriverAlarmInfo(@RequestParam(value = "carNo", required = false) String carNo,
                                   @RequestParam(value = "driverName", required = false) String driverName,
                                   @RequestParam(value = "alarmType", required = false) String alarmType,
                                   @RequestParam(value = "startTime", required = false) String startTime,
                                   @RequestParam(value = "endTime", required = false) String endTime) {
        int alarmTypeInt = -1;
        if (StringUtils.isNotBlank(alarmType)) {
            if ("-1".equals(alarmType)) {
                alarmTypeInt = Integer.parseInt(alarmType);
            } else if (!StringUtils.isNumeric(alarmType)) {
                log.error("alarmType参数有误");
                return null;
            } else {
                alarmTypeInt = Integer.parseInt(alarmType);
            }
        }
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String userId = mapDetail.get("userId").toString();
        return alarmService.getAlarmForDriver(carNo, driverName, alarmTypeInt, startTime, endTime, userId);
    }

    @PostMapping("/searchAlarmInfo")
    @Timed
    @ResponseBody
    public List searchAlarm(  @RequestParam(value = "alarmType", required = false) String alarmType){
        int alarmTypeInt = -1;
        if (StringUtils.isNotBlank(alarmType)) {
            if (!StringUtils.isNumeric(alarmType)) {
                log.error("alarmType参数有误");
                return null;
            } else {
                alarmTypeInt = Integer.parseInt(alarmType);
            }
        }
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        boolean flag = (boolean)mapDetail.get("userType");
        List<Map> list = alarmService.getAlarmType(companyId,null);

        if(list == null || list.size() ==0){
            return null;
        }
        return  alarmService.searchAlarm(userId,companyId,alarmTypeInt,list,flag);
    }

    @PostMapping("/getAlarmEvaluation")
    @Timed
    @ResponseBody
    public List getAlarmEvaluation( @RequestParam(value = "driverName", required = false) String driverName,
                                    @RequestParam(value = "keyIdList", required = false) List keyIdList,
                                    @RequestParam(value = "groupIdList", required = false) List groupIdList,
                                    @RequestParam(value = "groupId", required = false) String groupId,
                                    @RequestParam(value = "time", required = false) String time) {

        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        return alarmService.getAlarmEvaluation(driverName,companyId,keyIdList,groupIdList,groupId,time);
    }

    @PostMapping("/dealAlarmInfo")
    @Timed
    @ResponseBody
    public BaseReturnMessage dealAlarmInfo(@RequestParam(value = "alarmType", required = false) String alarmType,
                              @RequestParam(value = "alarmDate", required = false) String alarmDate,
                              @RequestParam(value = "alarminfoLatitude", required = false) String alarminfoLatitude,
                              @RequestParam(value = "alarminfoLongitude", required = false) String alarminfoLongitude,
                              @RequestParam(value = "alarmSpeed", required = false) String alarmSpeed,
                              @RequestParam(value = "alarmName", required = false) String alarmName,
                              @RequestParam(value = "alarmTreat", required = false) String alarmTreat,
                              @RequestParam(value = "alarmTreatContent", required = false) String alarmTreatContent,
                              @RequestParam(value = "keyId", required = false) String keyId,
                              @RequestParam(value = "alarmDesc", required = false) String alarmDesc,
                              @RequestParam(value = "alarmEndDate", required = false) String alarmEndDate,
                               @RequestParam(value = "treatPerson", required = false) String treatPerson,
                               @RequestParam(value = "id", required = false) String alarmNo
    )
 {
     BaseReturnMessage BaseReturnMessage = new BaseReturnMessage();
     int alarmTypeInt = -1;
     int alarmTreatInt = -1;
     if (StringUtils.isNotBlank(alarmType)) {
         if (!StringUtils.isNumeric(alarmType)) {
             BaseReturnMessage.setResult(Constants.FAULT);
             BaseReturnMessage.setMessage("报警类型参数有误");
             log.error("报警类型参数有误");
             return BaseReturnMessage;
         } else {
             alarmTypeInt = Integer.parseInt(alarmType);
         }
     }else{
         BaseReturnMessage.setResult(Constants.FAULT);
         BaseReturnMessage.setMessage("报警类型不能为空");
         return BaseReturnMessage;
     }
     if (StringUtils.isNotBlank(alarmTreat)) {
         if (!StringUtils.isNumeric(alarmTreat)) {
             BaseReturnMessage.setResult(Constants.FAULT);
             BaseReturnMessage.setMessage("报警处理参数有误");
             log.error("报警处理参数有误");
             return BaseReturnMessage;
         } else {
             alarmTreatInt = Integer.parseInt(alarmTreat);
         }
     }else{
         BaseReturnMessage.setResult(Constants.FAULT);
         BaseReturnMessage.setMessage("报警处理参数不能为空");
         return BaseReturnMessage;
     }
     Map<String,Object>paramMap = new HashMap<String,Object>();
     paramMap.put("alarmType",alarmTypeInt);
     paramMap.put("alarmDate",alarmDate);
     paramMap.put("alarminfoLatitude",alarminfoLatitude);
     paramMap.put("alarminfoLongitude",alarminfoLongitude);
     paramMap.put("alarmSpeed",alarmSpeed);
     paramMap.put("alarmName",alarmName);
     paramMap.put("alarmTreat",alarmTreatInt);
     paramMap.put("alarmTreatContent",alarmTreatContent);
     paramMap.put("keyId",keyId);
     paramMap.put("alarmDesc",alarmDesc);
     paramMap.put("alarmEndDate",alarmEndDate);
     paramMap.put("treatPerson",treatPerson);
     paramMap.put("alarmNo",alarmNo);
     try {
         alarmService.dealAlarm(paramMap);
         BaseReturnMessage.setResult(Constants.SUCCESS);
         BaseReturnMessage.setMessage("操作成功");
         return BaseReturnMessage;
     }catch (Exception e){
         BaseReturnMessage.setResult(Constants.FAULT);
         BaseReturnMessage.setMessage("出现异常,请稍后再试");
         return BaseReturnMessage;
     }
    }

    @PostMapping("/searchAlarmLog")
    @Timed
    @ResponseBody
    public List searchAlarmLog(
        @RequestParam Map<String,String >map,
//                                @RequestParam(value = "userName", required = false) String userName,
//                                @RequestParam(value = "startTime", required = false) String startTime,
//                                @RequestParam(value = "endTime", required = false) String endTime
        String userName,String startTime,String endTime
    ){
        return alarmService.searchAlarmLog(userName,startTime,endTime);
//        for(Map.Entry<String,String>entry: map.entrySet()){
//            System.out.println(entry.getKey()+"||"+entry.getValue());
//        }
//        return null;
    }

    @PostMapping("/getMediaJSONForType")
    @Timed
    @ResponseBody
    public List<Map> getMediaJSONForType(@RequestParam(value = "fileType", required = true)String fileType,
                                  @RequestParam(value = "id", required = true) String alarmNo){
        return alarmService.getMediaJSONForType(alarmNo,fileType);
    }

    @PostMapping("/getMediaIOForType")
    @Timed
    @ResponseBody
    public List<Map> getMediaIOForType(@RequestParam(value = "fileType", required = true)String fileType,
                                  @RequestParam(value = "id", required = true) String alarmNo){
        return  alarmService.getMediaIOForType(alarmNo,fileType);
    }


    @RequestMapping("/getMediaIOForFileName")
    @Timed
    @ResponseBody
    public void getMediaIOForFileName(@RequestParam(value = "fileName", required = true)String fileName,
                                      HttpServletResponse response){
        try {
            response.setHeader("Cache-Control", "private");
            response.setHeader("Content-disposition",
                "attachment;filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
            response.setContentType("application/octet-stream;charset=utf-8");
            response.getOutputStream().write( alarmService.getMediaIOForFileName(fileName));
        } catch (IOException e) {
            e.printStackTrace();
        };

    }
}
