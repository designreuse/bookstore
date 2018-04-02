package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.service.AlarmService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AlarmDataCountResource {

    private final Logger log = LoggerFactory.getLogger(AlarmDataCountResource.class);

    @Resource
    private AlarmService alarmService;

    @PostMapping("/getAlarmDateCountInfo")
    @Timed
    @ResponseBody
    public List getAlarm(@RequestParam(value = "dateType", required = false) String dateType,
                             @RequestParam(value = "searchTime", required = false) String searchTime,
                            @RequestParam(value = "week", required = false) String week,
                             @RequestParam(value = "groupIdList", required = false) List<String> groupIdList,
                         @RequestParam(value = "alarmType", required = false) String alarmType,
                         @RequestParam(value = "keyIdList", required = false) List<String> keyIdList,
                         @RequestParam(value = "driverName", required = false) String driverName){
        List errorList = new ArrayList<ArrayList>();
        List arr = new ArrayList();
        arr.add(0);
        errorList.add(arr);
        int DateTypeInt = Constants.TYPE_YEAR;
        int alarmTypeInt = Constants.SUM_ALARM_TYPE;
        int weekInt = -1;
        List<HashMap<String, Object>> AlarmDataCountList =  new ArrayList<HashMap<String,Object>>();
        if(StringUtils.isBlank(dateType)) {
            log.error("dateType参数为空");
            return errorList;
        }
        if( !StringUtils.isNumeric(dateType)) {
            log.error("dateType参数有误");
            return errorList;
        }else{
            DateTypeInt = Integer.parseInt(dateType);
        }
        if(StringUtils.isBlank(searchTime)){
            log.error("搜索时间不能为空");
            return errorList;
        }
        if(DateTypeInt == Constants.TYPE_WEEK){
            if( !StringUtils.isNumeric(week)) {
                log.error("week参数有误");
                return errorList;
            }else{
                weekInt = Integer.parseInt(week);
            }
        }
        if(StringUtils.isNotBlank(alarmType)&& !"-1".equals(alarmType)){
            if( !StringUtils.isNumeric(alarmType)) {
                log.error("alarmType参数有误");
                return errorList;
            }else{
                alarmTypeInt = Integer.parseInt(alarmType);
            }
        }
        if( !Constants.ALARM_TYPE_COUNT_MAP.keySet().contains(alarmTypeInt)){
            log.error("不存在该类型报警..alarmType："+alarmTypeInt);
                return errorList;
        }
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<String> userGroupIdList = (List<String>)mapDetail.get("groupIdList");
        List list= alarmService.getAlarmDataCount(companyId,userGroupIdList,groupIdList,alarmTypeInt,DateTypeInt,searchTime,weekInt,keyIdList,driverName);
        return list;
    }

    @PostMapping("/getAlarmPicDateCountInfo")
    @Timed
    @ResponseBody
    public List getAlarmPicInfo(@RequestParam(value = "dateType", required = false) String dateType,
                                @RequestParam(value = "searchTime", required = false) String searchTime,
                                @RequestParam(value = "week", required = false) String week,
                                @RequestParam(value = "groupIdList", required = false) List<String> groupIdList,
                                @RequestParam(value = "keyIdList", required = false) List<String> keyIdList,
                                @RequestParam(value = "driverName", required = false) String driverName){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        int DateTypeInt = Constants.TYPE_YEAR;;
        int weekInt = -1;
        String TimeStr = "";
        List<HashMap<String, Object>> AlarmDataCountList =  new ArrayList<HashMap<String,Object>>();
        if(StringUtils.isNotBlank(dateType)){
            if( !StringUtils.isNumeric(dateType)) {
                log.error("alarmType参数有误");
                return null;
            }else{
                DateTypeInt = Integer.parseInt(dateType);
            }
        }

        if(StringUtils.isBlank(searchTime)){
            return null;
        }

        if(DateTypeInt == Constants.TYPE_WEEK){
            if( !StringUtils.isNumeric(week)) {
                log.error("week参数有误");
                return null;
            }else{
                weekInt = Integer.parseInt(week);
            }
        }
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<String> userGroupIdList = (List<String>)mapDetail.get("groupIdList");
        List list= alarmService.getAlarmDataCountPicture(companyId,userGroupIdList,groupIdList,DateTypeInt,searchTime,weekInt,keyIdList,driverName);
        return list;
    }
}
