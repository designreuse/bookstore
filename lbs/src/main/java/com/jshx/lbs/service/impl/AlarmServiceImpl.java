package com.jshx.lbs.service.impl;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.service.AlarmService;
import com.jshx.lbs.service.mapper.AlarmMapper;
import com.jshx.lbs.service.mapper.DictionaryMapper;
import com.jshx.lbs.web.rest.util.AddressUtil;
import com.jshx.lbs.web.rest.util.AlarmUtil;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import com.jshx.lbs.web.rest.util.OOSUtil;
import io.swagger.models.auth.In;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.lang.model.type.ErrorType;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Service("AlarmService")
public class AlarmServiceImpl implements AlarmService {
    @Override
    public byte[] getMediaIOForFileName(String fileName) {
        try {
            return  OOSUtil.getIO(fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Resource
    private AlarmMapper alarmMapper;

    @Resource
    private DictionaryMapper dictionaryMapper;

    @Override
    public List<Map> getAlarmInfo(String carNo, int alarmType,List groupIdList,List keyIdList,String driverName,String alarmLevel,int alarmTreat, String startTime, String endTime, String userId,Map<String,Object>logParamMap) {
        Map<String,Object> colorParam = new HashMap<String,Object>();
        colorParam.put("dictId","AP");
        List<Map>colorList = dictionaryMapper.getDictionary(colorParam);
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("carNo",carNo);
        paramMap.put("alarmType",alarmType);
        paramMap.put("groupIdList",groupIdList);
        paramMap.put("keyIdList",keyIdList);
        paramMap.put("driverName",driverName);
        paramMap.put("alarmLevel",alarmLevel);
        paramMap.put("alarmTreat",alarmTreat);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("userId",userId);
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> alarmMapResult = AlarmUtil.getAlarmTypeInfo(alarmMapper,companyId);
        Map<String,Object>alarmMap = new HashMap<String, Object>();
        Map<String,Object>superGroupNameMap = new HashMap<String, Object>();
        if(alarmMapResult!=null && alarmMapResult.size() != 0) {
            for (Map<String, Object> map : alarmMapResult) {
                alarmMap.put(map.get("alarmType").toString(),map.get("name"));
            }
        }
        List<Map> resultMap = alarmMapper.getAlarmInfo(paramMap);
        logParamMap.put("logContent",getLogContent(companyId,logParamMap.get("userName").toString(),logParamMap.get("date").toString(),carNo,alarmType,groupIdList,driverName,alarmLevel,alarmTreat,startTime,endTime,resultMap.size(),Constants.AlarmTypeSecess));
        saveAlarmLog(logParamMap);
        if (resultMap != null && resultMap.size() != 0) {
            for (Map<String, Object> map : resultMap) {
                map.put("superGroupName",map.get("GROUPNAME"));

                if(superGroupNameMap.get(map.get("GROUPID"))!=null){
                    map.put("superGroupName",superGroupNameMap.get(map.get("GROUPID")));
                }else {
                    Map<String, Object> getNameParamMap = new HashMap<String, Object>();
                    getNameParamMap.put("companyId", companyId);
                    getNameParamMap.put("groupId", map.get("GROUPID"));
                    String superGroupName = alarmMapper.getSuperGroupName(getNameParamMap);
                    if(StringUtils.isNotBlank(superGroupName)){
                        map.put("superGroupName",superGroupName);
                        superGroupNameMap.put(map.get("GROUPID").toString(),superGroupName);
                    }else{
                        superGroupNameMap.put(map.get("GROUPID").toString(),map.get("GROUPNAME"));
                    }
                }

//                if (map.get("DURATION_SECEND") == null) {
//                    map.put("DURATION", "0秒");
//                } else {
//                    int duration = Integer.parseInt(map.get("DURATION_SECEND").toString());
//                    if (duration < 60) {
//                        if (duration == 0) {
//                            map.put("DURATION", "1秒");
//                        } else {
//                            map.put("DURATION", duration + "秒");
//                        }
//                    } else {
//                        if (duration < 3600) {
//                            int floor = (int) Math.floor(duration / 60);
//                            int ny = duration % 60;
//                            map.put("DURATION", floor + "分" + ny + "秒");
//                        } else {
//                            int floor = (int) Math.floor(duration / 3600);
//                            int ny = duration % 3600;
//                            int floor1 = (int) Math.floor(ny / 60);
//                            int ny1 = ny % 60;
//                            map.put("DURATION", floor + "小时" + floor1 + "分" + ny1 + "秒");
//                        }
//
//
//                    }
//                }
                map.put("alarmName","");
                if(alarmMap.get(map.get("ALARM_TYPE").toString())!=null){
                    map.put("alarmName",alarmMap.get(map.get("ALARM_TYPE").toString()));
                }

                if(map.get("ID") == null){
                    map.put("ID","");
                }
//                map.put("alarmAdress","");
//                if(map.get("ALARMINFO_LONGITUDE")!=null&& StringUtils.isNotBlank(map.get("ALARMINFO_LONGITUDE").toString())&&map.get("ALARMINFO_LATITUDE")!=null&& StringUtils.isNotBlank(map.get("ALARMINFO_LATITUDE").toString())) {
//                    map.put("alarmAdress", AddressUtil.getAddress(map.get("ALARMINFO_LONGITUDE").toString(), map.get("ALARMINFO_LATITUDE").toString()));
//                }
                map.put("ALARM_TREAT_STR","");
                if(map.get("ALARM_TREAT") != null && StringUtils.isNotBlank(map.get("ALARM_TREAT").toString())){
                    map.put("ALARM_TREAT_STR", Constants.ALARM_TREAT_MAP.get(map.get("ALARM_TREAT").toString()));
                }else{
                    map.put("ALARM_TREAT_STR", Constants.ALARM_TREAT_MAP.get("4"));
                }
                map.put("ALARM_LEVEL_STR",Constants.ALARM_LEVEL_MAP.get("0"));
                if(map.get("ALARM_LEVEL") != null && StringUtils.isNotBlank(map.get("ALARM_LEVEL").toString())){
                    map.put("ALARM_LEVEL_STR", Constants.ALARM_LEVEL_MAP.get(map.get("ALARM_LEVEL").toString()));
                }
                map.put("CAR_AND_PLATECOLOR","");
                if(map.get("CAR_NO")!=null&& StringUtils.isNotBlank(map.get("CAR_NO").toString())&&map.get("PLATECOLOR")!=null&& StringUtils.isNotBlank(map.get("PLATECOLOR").toString())) {
                    map.put("CAR_AND_PLATECOLOR", map.get("CAR_NO").toString() + "(" + Constants.COLOR_MAP.get(map.get("PLATECOLOR").toString()) + ")");
                }
//               for(Map<String,Object> colorMap: colorList){
 //                   map.put("CAR_AND_PLATECOLOR", map.get("CAR_NO").toString() + "(" + Constants.COLOR_MAP.get(map.get("PLATECOLOR").toString()) + ")");
//                    if(colorMap.get("DICTVALUE").toString().equals(map.get("PLATECOLOR").toString()) ){
//                        map.put("CAR_AND_PLATECOLOR",map.get("CAR_NO").toString() +"("+colorMap.get("DESCRIPTION").toString()+")");
//                    }
//                }
                map.put("VoicesFlag",false);
                map.put("MoviesFlag",false);
                map.put("TxtsFlag",false);
                map.put("PicesFlag",false);
                map.put("OthersFlag",false);
                if(map.get("FILETYPE")!=null && StringUtils.isNotBlank(map.get("FILETYPE").toString())) {
                   String flages = map.get("FILETYPE").toString();
                   String[] flagArr = flages.split(",");
                   for(String flag : flagArr){
                       if(flag.equals(Constants.TXT_TYPE)){
                           map.put("TxtsFlag",true);
                       }if(flag.equals(Constants.VOICE_TYPE)){
                           map.put("VoicesFlag",true);
                       }if(flag.equals(Constants.PIC_TYPE)){
                           map.put("PicesFlag",true);
                       }if(flag.equals(Constants.MOVIE_TYPE)){
                           map.put("MoviesFlag",true);
                       }if(flag.equals(Constants.OTHER_TYPE)){
                           map.put("OthersFlag",true);
                       }
                   }
                }
            }
        }
        return resultMap;
    }

    @Override
    public List<Map> getAlarmInfoByPage(String carNo, int alarmType,List keyIdList, String startTime, String endTime, int pageNum) {
        int PageIndex = 0;
        int startNum = pageNum * 10 + 1;
        int endNum = (pageNum+ 1) * 10;
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String userid = mapDetail.get("userId").toString();
        String companyId = mapDetail.get("companyId").toString();
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("carNo",carNo);
        paramMap.put("alarmType",alarmType);
        paramMap.put("keyIdList",keyIdList);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("userId",userid);
        paramMap.put("startNum",startNum);
        paramMap.put("endNum",endNum);
        List<Map> resultMap = alarmMapper.getAlarmInfoByPage(paramMap);
        return resultMap;
    }

    @Override
    public List getAlarmDataCount(String companyId, List<String> userGroupIdList, List<String> groupIdList,int alarmType, int DateType, String searchTime,int week,List keyIdList,String driverName) {
        List errorList = new ArrayList<ArrayList>();
        List arr = new ArrayList();
        arr.add(0);
        errorList.add(arr);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM");
        SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy");
        SimpleDateFormat sdf4 = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat sdf5 = new SimpleDateFormat("yyyy-MM-dd");
        String weekStartTime = "";
        String weekEndTime = "";
        //周对比日期
        List<String>compareDate = new ArrayList<>();

        List<String>DateRealList = new ArrayList<String>();
        DateRealList.add("星期一");
        DateRealList.add("星期二");
        DateRealList.add("星期三");
        DateRealList.add("星期四");
        DateRealList.add("星期五");
        DateRealList.add("星期六");
        DateRealList.add("星期日");
        //类型开关
        boolean flag = DateType == Constants.TYPE_YEAR;
        int MaxDay = 0;
        try {
            if(DateType == 2){

                    Calendar cal =   Calendar.getInstance();
                    cal.setTime(sdf.parse(searchTime));
                    //获取当月最大天数
                    MaxDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

            }if(DateType == 3){
                Date year = sdf3.parse(searchTime);
                Calendar cal = Calendar.getInstance();
                cal.setTime(year);
                //获取一年中第一个星期一
                if(cal.get(Calendar.DAY_OF_WEEK)-2>=0){
                    System.out.println(Calendar.DAY_OF_WEEK);
                    cal.add(Calendar.DAY_OF_MONTH, 9-cal.get(Calendar.DAY_OF_WEEK)==7?0:9-cal.get(Calendar.DAY_OF_WEEK));
                }else{
                    cal.add(Calendar.DAY_OF_MONTH,1);
                }
                cal.add(Calendar.DAY_OF_MONTH,7*(week-1));
                if(!Integer.toString(cal.get(Calendar.YEAR)).equals(searchTime)){
                    System.out.println("按周查询传入周数过大...周数:"+week);
                    return new ArrayList<Map<String,String>>();
                }
                //周开始时间
                weekStartTime =sdf4.format(cal.getTime());
                for(int i=0;i<7;i++){
                    compareDate.add(sdf5.format(cal.getTime()));
                    cal.add(Calendar.DAY_OF_MONTH,1);
                }
                //周结束时间
                weekEndTime = sdf4.format(cal.getTime());
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return errorList;
        }
        List<List> total = new ArrayList();
        //拼接日期数组
        List<String> dateList = new ArrayList<String>();

        if(DateType == 1){
            for(int i=1;i<=12;i++){
                if (i<10){

                    dateList.add(searchTime+"-0"+i);

                }else{
                    dateList.add(searchTime+"-"+i);
                }
            }
            total.add(dateList);
        }else if(DateType == 2){
            String searchTime2 = "";
            try {
                 searchTime2 =sdf2.format(sdf.parse(searchTime));
            } catch (ParseException e) {
                e.printStackTrace();
                return null;
            }
            for (int i = 1; i <= MaxDay; i++) {
                if (i < 10) {
                    dateList.add(searchTime2+"-0"+i);
                } else {
                    dateList.add(searchTime2+"-"+i);
                }
            }
            total.add(dateList);
        }else if(DateType == 3){
            dateList = compareDate;
            total.add(DateRealList);
        }

        //拼接告警类型默认数据
        List<String> AlarmTypeList = new ArrayList<String>();
        if(alarmType == Constants.SUM_ALARM_TYPE){
            for (Map.Entry<Integer,String> entry : Constants.ALARM_TYPE_COUNT_MAP.entrySet()){
                AlarmTypeList.add(entry.getValue());
            }
            total.add(AlarmTypeList);
            for (Map.Entry<Integer,String> entry : Constants.ALARM_TYPE_COUNT_MAP.entrySet()) {
                List<String> list =  new ArrayList<>();
                if(DateType == 1){
                    for(int i=1;i<=12;i++){

                        list.add("-");
                    }
                }else if(DateType == 2){
                    for (int i = 1; i <= MaxDay; i++) {
                        list.add("-");
                    }
                }else if(DateType == 3){
                    for (int i = 1; i <= 7; i++) {
                        list.add("-");
                    }
                }
                total.add(list);
            }
        }else{
            AlarmTypeList.add(Constants.ALARM_TYPE_COUNT_MAP.get(alarmType));
            total.add(AlarmTypeList);
            List<String> list =  new ArrayList<>();
            if(DateType == 1){
                for(int i=1;i<=12;i++){

                    list.add("-");
                }
            }else if(DateType == 2){
                for (int i = 1; i <= MaxDay; i++) {
                    list.add("-");
                }
            }else if(DateType == 3){
                for (int i = 1; i <= 7; i++) {
                    list.add("-");
                }
            }
            total.add(list);
        }
        if(groupIdList == null || groupIdList.size() == 0){
            groupIdList = userGroupIdList;
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("flag",DateType == Constants.TYPE_YEAR);
        paramMap.put("dateType",DateType);
        paramMap.put("companyId",companyId);
        paramMap.put("groupIdList",groupIdList);
        paramMap.put("AlarmTypeList",AlarmTypeList);
        paramMap.put("searchTime",searchTime);
        paramMap.put("weekStartTime",weekStartTime);
        paramMap.put("weekEndTime",weekEndTime);
        paramMap.put("keyIdList",keyIdList);
        paramMap.put("driverName",driverName);
        //告警类型数据查询
        List<Map> resultMap = alarmMapper.getAlarmDataCount(paramMap);
        if(resultMap!=null && resultMap.size() != 0) {
            for (Map<String, Object> map : resultMap) {
                for (String date : dateList) {
                    if (date.equals(map.get("FORDAY").toString())) {
                        int num = dateList.indexOf(map.get("FORDAY").toString());
                        if (alarmType == Constants.SUM_ALARM_TYPE) {
                            for (Map.Entry<String, Integer> entry : Constants.ALARM_TYPE_SORT_MAP.entrySet()) {

                                total.get(entry.getValue() + 1).set(num, Integer.parseInt(map.get(entry.getKey()).toString()));
                            }
                        } else {
                            total.get(2).set(num, Integer.parseInt(map.get("NO_" + alarmType).toString()));
                        }
                    }
                }
            }
        }
        return total;
    }

        @Override
        public List<String[]> getAlarmDataCountPicture(String companyId, List<String> userGroupIdList, List<String> groupIdList, int DateType, String searchTime,int week,List keyIdList,String driverName) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
            SimpleDateFormat sdf2 = new SimpleDateFormat("yyyyMMdd");
            String weekStartTime = "";
            String weekEndTime = "";
            try{
                if(DateType == 3){
                    Date year = sdf.parse(searchTime);
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(year);
                    if(cal.get(Calendar.DAY_OF_WEEK)-2>=0){
                        System.out.println(Calendar.DAY_OF_WEEK);
                        cal.add(Calendar.DAY_OF_MONTH, 9-cal.get(Calendar.DAY_OF_WEEK)==7?0:9-cal.get(Calendar.DAY_OF_WEEK));
                    }else{
                        cal.add(Calendar.DAY_OF_MONTH,1);
                    }
                    cal.add(Calendar.DAY_OF_MONTH,7*(week-1));
                    if(!Integer.toString(cal.get(Calendar.YEAR)).equals(searchTime)){
                        System.out.println("按周查询传入周数过大...周数:"+week);
                        return null;
                    }
                    //周开始时间
                    weekStartTime =sdf2.format(cal.getTime());
                    cal.add(Calendar.DAY_OF_MONTH,6);
                    //周结束时间
                    weekEndTime = sdf2.format(cal.getTime());
                }
            } catch (ParseException e){
                e.printStackTrace();
                return null;
            }
            List<Object[]>list = new ArrayList<Object[]>();
            List<String> AlarmTypeList = new ArrayList<String>();
            Map<String,Object>paramMap = new HashMap<String,Object>();
            if(groupIdList == null || groupIdList.size() == 0){
                groupIdList = userGroupIdList;
            }
            paramMap.put("flag",DateType == Constants.TYPE_YEAR);
            paramMap.put("dateType",DateType);
            paramMap.put("companyId",companyId);
            paramMap.put("groupIdList",groupIdList);
            paramMap.put("AlarmTypeList",AlarmTypeList);
            paramMap.put("searchTime",searchTime);
            paramMap.put("weekStartTime",weekStartTime);
            paramMap.put("weekEndTime",weekEndTime);
            paramMap.put("keyIdList",keyIdList);
            paramMap.put("driverName",driverName);
            List<String[]> list2 = new ArrayList<String[]>();
            List<Map> resultMap = alarmMapper.getAlarmDataCountPicture(paramMap);
            if(resultMap!=null && resultMap.size()>0){
                Map map = resultMap.get(0);
                    for(Map.Entry<String,String> entry:Constants.ALARM_TYPE_NAME_MAP.entrySet())
                        list2.add(new String[]{entry.getValue(), map.get(entry.getKey()) == null ? "0" : map.get(entry.getKey()).toString()});
            }

            return list2;
    }

    @Override
    public List<Map> getAlarmType(String companyId,String alarmType) {
        Map<String,Object>paramMap = new HashMap<String,Object>();
        List<Map>returnMap =new ArrayList<Map>();
        paramMap.put("companyId",companyId);
        paramMap.put("alarmType",alarmType);
        List<Map>resultMap = alarmMapper.getAlarmType(paramMap);
        if(resultMap.size() == 0){
            return null;
        }
        for(Map<String,Object> map : resultMap){
            Map<String,Object>map1 = new HashMap<String,Object>();
            if("true".equals(map.get("ISSHOW")));{
                if(map.get("DURATION") == null || map.get("ALARMTYPEID") == null){
                    continue;
                }
                map1.put("duration",map.get("DURATION").toString());
                //若SETNAME有值，使用SETNAME中值作为类型，若SETNAME无值，则用DEFAULTNAME中值作为类型
                map1.put("alarmType",map.get("ALARMTYPEID"));
                if(map.get("SETNAME")!= null && StringUtils.isNotBlank(map.get("SETNAME").toString())){
                    map1.put("name",map.get("SETNAME").toString());
                }else if (map.get("DEFAULTNAME")!= null && StringUtils.isBlank(map.get("DEFAULTNAME").toString())){
                    map1.put("name",map.get("DEFAULTNAME"));
                }else{
                    map1.put("name","");
                }
            }
            returnMap.add(map1);
        }
        return returnMap;
    }


    @Override
    public List<Map> getAlarmForDriver(String carNo, String driverName, int alarmTypeInt, String startTime, String endTime, String userId) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> alarmMapResult = AlarmUtil.getAlarmTypeInfo(alarmMapper,companyId);
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("carNo",carNo);
        paramMap.put("driverName",driverName);
        paramMap.put("alarmType",alarmTypeInt);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("userId",userId);
        List<Map> resultMap = alarmMapper.getAlarmForDriver(paramMap);

        if(resultMap != null){
            for(Map result : resultMap){
                if(result.get("ALARM_TYPE")!= null && ("-1").equals(result.get("ALARM_TYPE").toString())){
                    result.put("alarmName","总数");
                }else{
                    result.put("alarmName","");
                    if(alarmMapResult!=null && alarmMapResult.size() != 0){
                        for(Map<String,Object> alarmMap : alarmMapResult){
                            if(result.get("ALARM_TYPE")!=null && alarmMap.get("alarmType").equals(result.get("ALARM_TYPE").toString())){
                                result.put("alarmName",alarmMap.get("name"));
                            }
                        }
                    }
                }
            }
        }

        return resultMap;
    }

    @Override
    public List<Map> searchAlarm(String userId,String companyId,int alarmType, List<Map> list, boolean flag) {
        List<Map> alarmMapResult = AlarmUtil.getAlarmTypeInfo(alarmMapper,companyId);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("alarmType", alarmType);
        paramMap.put("list", list);
        paramMap.put("companyId", companyId);
        paramMap.put("userId", userId);
        List<Map> resultMap = null;
        if (flag) {
            resultMap = alarmMapper.searchAlarmForSupserMan(paramMap);
        } else {
            resultMap = alarmMapper.searchAlarm(paramMap);

        }
        if(resultMap != null){
            for(Map result : resultMap){
                result.put("alarmName","");
                if(alarmMapResult!=null && alarmMapResult.size() != 0){
                    for(Map<String,Object> alarmMap : alarmMapResult){
                        if(result.get("ALARM_TYPE")!=null && alarmMap.get("alarmType").equals(result.get("ALARM_TYPE").toString())){
                            result.put("alarmName",alarmMap.get("name"));
                        }
                    }
                }
            }
        }
        return resultMap;
    }

    @Override
    public List<Map> getAlarmEvaluation(String driverName,String companyId,List keyIdList,List groupIdList,String groupId,String time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        DecimalFormat df = new DecimalFormat("#.00");
        Date date = new Date();
        try {
             date = sdf.parse(time);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, -1);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("driverName", driverName);
        paramMap.put("companyId", companyId);
        paramMap.put("keyIdList", keyIdList);
        paramMap.put("time",  sdf.format(cal.getTime()));
        paramMap.put("groupIdList",groupIdList);
        paramMap.put("groupId",groupId);
        Map<Integer,Map> returnMap = new HashMap<Integer,Map>();
        //前一个月数据
        List<Map> resultList = alarmMapper.getAlarmEvaluation(paramMap);
        if(resultList != null && resultList.size()>0){
            for (Map map : resultList) {
                getScore(map);
            }
        }
        Map<String, Object> paramMap2 = new HashMap<String, Object>();
        paramMap2.put("driverName", driverName);
        paramMap2.put("companyId", companyId);
        paramMap2.put("keyIdList", keyIdList);
        paramMap2.put("time",  sdf.format(date));
        paramMap.put("groupIdList",groupIdList);
        paramMap.put("groupId",groupId);
        Map<Integer,Map> returnMap2= new HashMap<Integer,Map>();
        List<Map>resultList2 = alarmMapper.getAlarmEvaluation(paramMap2);
        //获取当前公司的数据
        List<Map>resultList3 = alarmMapper.getAlarmEvaluationForCompany(paramMap2);

        if(resultList3 != null && resultList3.size()>0){
            Map map = resultList3.get(0);
            getScore(resultList3.get(0));
          /*  map.put("COMPANY_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("SCORE_COUNT").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_501_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_501_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_502_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_502_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_503_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_503_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_504_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_504_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_505_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_505_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_506_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_506_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_507_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_507_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_508_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_508_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));
            map.put("COMPANY_509_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_509_NO_SCORE").toString())/Double.parseDouble(map.get("NUM").toString())));*/
            map.put("COMPANY_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("SCORE_COUNT").toString())));
            map.put("COMPANY_501_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_501_NO_SCORE").toString())));
            map.put("COMPANY_502_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_502_NO_SCORE").toString())));
            map.put("COMPANY_503_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_503_NO_SCORE").toString())));
            map.put("COMPANY_504_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_504_NO_SCORE").toString())));
            map.put("COMPANY_505_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_505_NO_SCORE").toString())));
            map.put("COMPANY_506_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_506_NO_SCORE").toString())));
            map.put("COMPANY_507_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_507_NO_SCORE").toString())));
            map.put("COMPANY_508_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_508_NO_SCORE").toString())));
            map.put("COMPANY_509_SCORE_COUNT",String.format("%.2f",Double.parseDouble(map.get("ALARM_509_NO_SCORE").toString())));
        }
        //获取当前月的数据
        if(resultList2 != null && resultList2.size()>0) {
            for (Map map : resultList2) {
                getScore(map);

                //计算公司平均得分
                map.put("COMPANY_SCORE_COUNT",0);
                map.put("COMPANY_501_SCORE_COUNT",0);
                map.put("COMPANY_502_SCORE_COUNT",0);
                map.put("COMPANY_503_SCORE_COUNT",0);
                map.put("COMPANY_504_SCORE_COUNT",0);
                map.put("COMPANY_505_SCORE_COUNT",0);
                map.put("COMPANY_506_SCORE_COUNT",0);
                map.put("COMPANY_507_SCORE_COUNT",0);
                map.put("COMPANY_508_SCORE_COUNT",0);
                map.put("COMPANY_509_SCORE_COUNT",0);
                if (resultList3 != null && resultList3.size() > 0) {
                    for (Map companyMap : resultList3) {
                        map.put("COMPANY_SCORE_COUNT", companyMap.get("COMPANY_SCORE_COUNT").toString());
                        map.put("COMPANY_501_SCORE_COUNT", companyMap.get("COMPANY_501_SCORE_COUNT").toString());
                        map.put("COMPANY_502_SCORE_COUNT", companyMap.get("COMPANY_502_SCORE_COUNT").toString());
                        map.put("COMPANY_503_SCORE_COUNT", companyMap.get("COMPANY_503_SCORE_COUNT").toString());
                        map.put("COMPANY_504_SCORE_COUNT", companyMap.get("COMPANY_504_SCORE_COUNT").toString());
                        map.put("COMPANY_505_SCORE_COUNT", companyMap.get("COMPANY_505_SCORE_COUNT").toString());
                        map.put("COMPANY_506_SCORE_COUNT", companyMap.get("COMPANY_506_SCORE_COUNT").toString());
                        map.put("COMPANY_507_SCORE_COUNT", companyMap.get("COMPANY_507_SCORE_COUNT").toString());
                        map.put("COMPANY_508_SCORE_COUNT", companyMap.get("COMPANY_508_SCORE_COUNT").toString());
                        map.put("COMPANY_509_SCORE_COUNT", companyMap.get("COMPANY_509_SCORE_COUNT").toString());
                    }
                }

                //计算环比
                map.put("SURROUND_RATE", 1);
                map.put("SURROUND_501_RATE", 1);
                map.put("SURROUND_502_RATE", 1);
                map.put("SURROUND_503_RATE", 1);
                map.put("SURROUND_504_RATE", 1);
                map.put("SURROUND_505_RATE", 1);
                map.put("SURROUND_506_RATE", 1);
                map.put("SURROUND_507_RATE", 1);
                map.put("SURROUND_508_RATE", 1);
                map.put("SURROUND_509_RATE", 1);
                if (resultList != null && resultList.size() > 0) {
                    for (Map beforMonthMap : resultList) {
                        if (map.get("KEYID").toString().equals(beforMonthMap.get("KEYID").toString())) {
                            if(Double.parseDouble(beforMonthMap.get("SCORE_COUNT").toString())>0){
                                map.put("SURROUND_RATE", String.format("%.2f",Double.parseDouble(map.get("SCORE_COUNT").toString()) / Double.parseDouble(beforMonthMap.get("SCORE_COUNT").toString())));
                            } if(Double.parseDouble(beforMonthMap.get("ALARM_501_NO_SCORE").toString())>0){
                                map.put("SURROUND_501_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_501_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_501_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_502_NO_SCORE").toString())>0){
                                map.put("SURROUND_502_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_502_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_502_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_503_NO_SCORE").toString())>0){
                                map.put("SURROUND_503_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_503_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_503_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_504_NO_SCORE").toString())>0){
                                map.put("SURROUND_504_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_504_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_504_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_505_NO_SCORE").toString())>0){
                                map.put("SURROUND_505_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_505_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_505_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_506_NO_SCORE").toString())>0){
                                map.put("SURROUND_506_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_506_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_506_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_507_NO_SCORE").toString())>0){
                                map.put("SURROUND_507_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_507_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_507_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_508_NO_SCORE").toString())>0){
                                map.put("SURROUND_508_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_508_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_508_NO_SCORE").toString())));
                            }if(Double.parseDouble(beforMonthMap.get("ALARM_509_NO_SCORE").toString())>0){
                                map.put("SURROUND_509_RATE",String.format("%.2f",Double.parseDouble(map.get("ALARM_509_NO_SCORE").toString()) / Double.parseDouble(beforMonthMap.get("ALARM_509_NO_SCORE").toString())));
                            }
                        }
                    }
                }
            }
        }
        return resultList2;
    }

    @Override
    public void dealAlarm(Map map) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        map.put("alarmTreatTime",sdf.format(new Date()));
        map.put("id",  UUID.randomUUID().toString());
        Map<String,Object>paramMap = new HashMap<String, Object>();
        String userId = mapDetail.get("userId").toString();
        paramMap.put("userId",userId);
        paramMap.put("alarmNo",map.get("alarmNo"));
        if(map.get("alarmNo") == null || StringUtils.isBlank(map.get("alarmNo").toString())){
            if(map.get("keyId") != null && map.get("alarmType") != null && map.get("alarmDate") != null && StringUtils.isNotBlank(map.get("keyId").toString()) && StringUtils.isNotBlank(map.get("alarmType").toString()) &&  StringUtils.isNotBlank(map.get("alarmDate").toString()) ) {
                String alarmNo = UUID.randomUUID().toString();
                paramMap.put("alarmNo", alarmNo);
                map.put("alarmNo", alarmNo);
                alarmMapper.alarmInfoAddAlarmNO(map);
                alarmMapper.alarmTreatAddAlarmNO(map);
            }else{
                System.out.println("无法确定该记录");
            }
        }
        List resultList = alarmMapper.getAlarmTreatInfoById(paramMap);
        if(resultList.size()>0){
            alarmMapper.updateAlarmTreat(map);
        }else{
            alarmMapper.dealAlarm(map);
        }
    }



    @Override
    public String getLogContent(String companyId, String userName, String date, String carNo, int alarmType,List groupIdList,String driverName,String alarmLevel,int alarmTreat, String startTime, String endTime, int result,int ErrorType){
        String str = "用户："+userName+",在"+date+",进行报警信息查询,查询条件为:";
        if(StringUtils.isNotBlank(carNo)){
            str+="车牌号:"+carNo+",";
        }
        if(StringUtils.isNotBlank(driverName)){
            str+="驾驶员名称:"+driverName+",";
        }
        if(StringUtils.isNotBlank(alarmLevel)){
            String level = alarmLevel.equals("0")?"一":"二";
            str+="报级等级为:"+level+"级报警,";
        }
            //str+="报级处理类型为:"+Constants.ALARM_TREAT_MAP.get(alarmTreat+"")+",";
        if(ErrorType == Constants.AlarmTypeError){
            str+="查询开始时间为:"+startTime+",查询结束时间为:"+endTime+",在查询时,查询报警类型参数有误";
        }else if(ErrorType == Constants.startTimeError){
            if(alarmType != -1){
                String alarmName =  getAlarmType(companyId,alarmType+"").get(0).get("name").toString();
                str+="报警类型为:"+alarmName+",查询结束时间为:"+endTime+",在查询时,查询开始时间为空";
            }else{
                str+="报警类型为:全部报警,查询结束时间为:"+endTime+",在查询时,查询开始时间为空";
            }

        }else if(ErrorType == Constants.endTimeError){
            if(alarmType != -1) {
                String alarmName = getAlarmType(companyId, alarmType + "").get(0).get("name").toString();
                str += "报警类型为:" + alarmName + ",查询开始时间为:" + startTime + ",在查询时,查询结束时间为空";
            }else{
                str += "报警类型为:全部报警,查询开始时间为:" + startTime + ",在查询时,查询结束时间为空";
            }
        }else{
            if(alarmType != -1) {
                String alarmName = getAlarmType(companyId, alarmType + "").get(0).get("name").toString();
                str += "报警类型为:" + alarmName + ",查询开始时间为:" + startTime + ",查询结束时间为:" + endTime + "共查询出" + result + "条记录";
            }else{
                str += "报警类型为:全部报警,查询开始时间为:" + startTime + ",查询结束时间为:" + endTime + ",共查询出" + result + "条记录";
            }
        }

        return str;
    }

    @Override
    public void saveAlarmLog(Map<String, Object> Param) {
            alarmMapper.saveAlarmLog(Param);
    }

    @Override
    public List<Map> searchAlarmLog(String userName,String startTime,String endTime) {
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("userName",userName);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
       return alarmMapper.searchAlarmLog(paramMap);
    }

    @Override
    public Map getAlarmTreatInfoById(String alarmNo,String keyId,String alarmType,String alarmDate) {
        Map<String,Object> colorParam = new HashMap<String,Object>();
        Map<String,Object>paramMap = new HashMap<String, Object>();
        colorParam.put("dictId","AP");
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        List<Map> alarmMapResult = AlarmUtil.getAlarmTypeInfo(alarmMapper,companyId);
        List<String>list = new ArrayList<String>();
        if(alarmMapResult!=null && alarmMapResult.size()>0){
            for(Map map : alarmMapResult){
                list.add(map.get("alarmType").toString());
            }
        }
        List<Map>colorList = dictionaryMapper.getDictionary(colorParam);
        paramMap.put("userId",userId);
        paramMap.put("alarmNo",alarmNo);
        paramMap.put("keyId",keyId);
        paramMap.put("alarmType",alarmType);
        paramMap.put("alarmDate",alarmDate);
        paramMap.put("alarmTypeList",list);
        if(StringUtils.isBlank(alarmNo)){
            if(StringUtils.isNotBlank("keyId") && StringUtils.isNotBlank("alarmType") &&  StringUtils.isNotBlank("alarmDate") ) {
                paramMap.put("alarmNo", UUID.randomUUID().toString());
                alarmMapper.alarmInfoAddAlarmNO(paramMap);
                alarmMapper.alarmTreatAddAlarmNO(paramMap);
            }else{
                return null;
            }
        }
        List<Map> resultMap = alarmMapper.getAlarmTreatInfoById(paramMap);
        Map map = null;
        if (resultMap != null && resultMap.size() != 0) {
            map = resultMap.get(0);
            if (map.get("DURATION_SECEND") == null) {
                map.put("DURATION", "0秒");
            } else {
                int duration = Integer.parseInt(map.get("DURATION_SECEND").toString());
                if (duration < 60) {
                    if (duration == 0) {
                        map.put("DURATION", "1秒");
                    } else {
                        map.put("DURATION", duration + "秒");
                    }
                } else {
                    if (duration < 3600) {
                        int floor = (int) Math.floor(duration / 60);
                        int ny = duration % 60;
                        map.put("DURATION", floor + "分" + ny + "秒");
                    } else {
                        int floor = (int) Math.floor(duration / 3600);
                        int ny = duration % 3600;
                        int floor1 = (int) Math.floor(ny / 60);
                        int ny1 = ny % 60;
                        map.put("DURATION", floor + "小时" + floor1 + "分" + ny1 + "秒");
                    }


                }
            }
            map.put("alarmName", "");
            if (alarmMapResult != null && alarmMapResult.size() != 0) {
                for (Map<String, Object> alarmMap : alarmMapResult) {
                    if (alarmMap.get("alarmType").equals(map.get("ALARM_TYPE").toString())) {
                        map.put("alarmName", alarmMap.get("name"));
                    }
                }
            }
            map.put("ALARM_LEVEL_STR","");
            if(map.get("ALARM_LEVEL") != null && StringUtils.isNotBlank(map.get("ALARM_LEVEL").toString())){
                map.put("ALARM_LEVEL_STR", Constants.ALARM_LEVEL_MAP.get(map.get("ALARM_LEVEL").toString()));
            }

            map.put("ALARM_TREAT_STR", "");
            if (map.get("ALARM_TREAT") != null && StringUtils.isNotBlank(map.get("ALARM_TREAT").toString())) {
                map.put("ALARM_TREAT_STR", Constants.ALARM_TREAT_MAP.get(map.get("ALARM_TREAT").toString()));
            } else {
                map.put("ALARM_TREAT_STR", Constants.ALARM_TREAT_MAP.get("4"));
            }
            for (Map<String, Object> colorMap : colorList) {
                map.put("CAR_AND_PLATECOLOR","");
                if(map.get("CAR_NO")!=null&&map.get("PLATECOLOR")!=null) {
                    map.put("CAR_AND_PLATECOLOR", map.get("CAR_NO").toString() + "(" + Constants.COLOR_MAP.get(map.get("PLATECOLOR").toString()) + ")");
                }
//                if (colorMap.get("DICTVALUE").toString().equals(map.get("PLATECOLOR").toString())) {
//                    //map.put("CAR_AND_PLATECOLOR", map.get("CAR_NO").toString() + "(" + colorMap.get("DESCRIPTION").toString() + ")");
//                }
            }
        }
        return map;
    }

    @Override
    public List<Map> getMediaJSONForType(String alarmNo, String fileType) {
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("alarmNo",alarmNo);
        paramMap.put("fileType",fileType);
        List<Map> list = alarmMapper.getMediaJSONForType(paramMap);
        if(list!=null && list.size()>0){
            for(Map<String,String>map :list){
                map.put("shareAddress","");
                if(StringUtils.isNotBlank(map.get("FILENAME"))){
                    map.put("shareAddress", OOSUtil.getShareUrl(map.get("FILENAME")));
                }
            }
        }
        return list;
    }

    @Override
    public List<Map> getMediaIOForType(String alarmNo, String fileType) {
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("alarmNo",alarmNo);
        paramMap.put("fileType",fileType);
        List<Map> list = alarmMapper.getMediaJSONForType(paramMap);
        if(list!=null && list.size()>0){
            for(Map<String,Object>map :list){
                map.put("mediaIO","");
                if(StringUtils.isNotBlank(map.get("FILENAME").toString())){
                    try {
                        map.put("mediaIO", OOSUtil.getIO(map.get("FILENAME").toString()));
                    }catch (Exception e){
                        System.out.println("IO流异常");
                        e.printStackTrace();
                    }
                }
            }
        }
        return list;
    }


    /**
     * 计算得分
     * */
    public void getScore(Map map){
        //百公里一级告警数
        Double ALARM_501_NO_100 = Integer.parseInt(map.get("ALARM_501_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        //百公里二级告警数
        Double ALARM_501_NO_L2_100 = Integer.parseInt(map.get("ALARM_501_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_501_NO_100",String.format("%.2f",ALARM_501_NO_100));
        map.put("ALARM_501_NO_L2_100",String.format("%.2f",ALARM_501_NO_L2_100));
        //百公里告警加权平均数
        Double ALARM_501_NO_AVG = Integer.parseInt(map.get("ALARM_501_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_501_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_501_NO_SCORE = 0d;
        //告警得分数
        if(ALARM_501_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(501)<0) {
            ALARM_501_NO_SCORE = (1 - ALARM_501_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(501)) * Constants.ALARM_TYPE_SCORE_MAP.get(501);
        }
        map.put("ALARM_501_NO_AVG",String.format("%.2f",ALARM_501_NO_AVG));
        map.put("ALARM_501_NO_SCORE",String.format("%.2f",ALARM_501_NO_SCORE));

        Double ALARM_502_NO_100 = Integer.parseInt(map.get("ALARM_502_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_502_NO_L2_100 = Integer.parseInt(map.get("ALARM_502_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_502_NO_100",String.format("%.2f",ALARM_502_NO_100));
        map.put("ALARM_502_NO_L2_100",String.format("%.2f",ALARM_502_NO_L2_100));
        Double ALARM_502_NO_AVG = Integer.parseInt(map.get("ALARM_502_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_502_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_502_NO_SCORE = 0d;
        if(ALARM_502_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(502)<0) {
            ALARM_502_NO_SCORE = (1 - ALARM_502_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(502)) * Constants.ALARM_TYPE_SCORE_MAP.get(502);
        }
        map.put("ALARM_502_NO_AVG",String.format("%.2f",ALARM_502_NO_AVG));
        map.put("ALARM_502_NO_SCORE",String.format("%.2f",ALARM_502_NO_SCORE));

        Double ALARM_503_NO_100 = Integer.parseInt(map.get("ALARM_503_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_503_NO_L2_100 = Integer.parseInt(map.get("ALARM_503_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_503_NO_100",String.format("%.2f",ALARM_503_NO_100));
        map.put("ALARM_503_NO_L2_100",String.format("%.2f",ALARM_503_NO_L2_100));
        Double ALARM_503_NO_AVG = Integer.parseInt(map.get("ALARM_503_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_503_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_503_NO_SCORE = 0d;
        if(ALARM_503_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(503)<0) {
            ALARM_503_NO_SCORE = (1 - ALARM_503_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(503)) * Constants.ALARM_TYPE_SCORE_MAP.get(503);
        }
        map.put("ALARM_503_NO_AVG",String.format("%.2f",ALARM_503_NO_AVG));
        map.put("ALARM_503_NO_SCORE",String.format("%.2f",ALARM_503_NO_SCORE));

        Double ALARM_504_NO_100 = Integer.parseInt(map.get("ALARM_504_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_504_NO_L2_100 = Integer.parseInt(map.get("ALARM_504_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_504_NO_100",String.format("%.2f",ALARM_504_NO_100));
        map.put("ALARM_504_NO_L2_100",String.format("%.2f",ALARM_504_NO_L2_100));
        Double ALARM_504_NO_AVG = Integer.parseInt(map.get("ALARM_504_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_504_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_504_NO_SCORE = 0d;
        if(ALARM_504_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(504)<0) {
            ALARM_504_NO_SCORE = (1 - ALARM_504_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(504)) * Constants.ALARM_TYPE_SCORE_MAP.get(504);
        }
        map.put("ALARM_504_NO_AVG",String.format("%.2f",ALARM_504_NO_AVG));
        map.put("ALARM_504_NO_SCORE",String.format("%.2f",ALARM_504_NO_SCORE));

        Double ALARM_505_NO_100 = Integer.parseInt(map.get("ALARM_505_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_505_NO_L2_100 = Integer.parseInt(map.get("ALARM_505_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_505_NO_100",String.format("%.2f",ALARM_505_NO_100));
        map.put("ALARM_505_NO_L2_100",String.format("%.2f",ALARM_505_NO_L2_100));
        Double ALARM_505_NO_AVG = Integer.parseInt(map.get("ALARM_505_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_505_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_505_NO_SCORE = 0d;
        if(ALARM_505_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(505)<0) {
            ALARM_505_NO_SCORE = (1 - ALARM_505_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(505)) * Constants.ALARM_TYPE_SCORE_MAP.get(505);
        }
        map.put("ALARM_505_NO_AVG",String.format("%.2f",ALARM_505_NO_AVG));
        map.put("ALARM_505_NO_SCORE",String.format("%.2f",ALARM_505_NO_SCORE));

        Double ALARM_506_NO_100 = Integer.parseInt(map.get("ALARM_506_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_506_NO_L2_100 = Integer.parseInt(map.get("ALARM_506_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_506_NO_100",String.format("%.2f",ALARM_506_NO_100));
        map.put("ALARM_506_NO_L2_100",String.format("%.2f",ALARM_506_NO_L2_100));
        Double ALARM_506_NO_AVG = Integer.parseInt(map.get("ALARM_506_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_506_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_506_NO_SCORE = 0d;
        if(ALARM_506_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(506)<0) {
            ALARM_506_NO_SCORE = (1 - ALARM_506_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(506)) * Constants.ALARM_TYPE_SCORE_MAP.get(506);
        }
        map.put("ALARM_506_NO_AVG",String.format("%.2f",ALARM_506_NO_AVG));
        map.put("ALARM_506_NO_SCORE",String.format("%.2f",ALARM_506_NO_SCORE));

        Double ALARM_507_NO_100 = Integer.parseInt(map.get("ALARM_507_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_507_NO_L2_100 = Integer.parseInt(map.get("ALARM_507_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_507_NO_100",String.format("%.2f",ALARM_507_NO_100));
        map.put("ALARM_507_NO_L2_100",String.format("%.2f",ALARM_507_NO_L2_100));
        Double ALARM_507_NO_AVG = Integer.parseInt(map.get("ALARM_507_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_507_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_507_NO_SCORE = 0d;
        if(ALARM_507_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(507)<0) {
            ALARM_507_NO_SCORE = (1 - ALARM_507_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(507)) * Constants.ALARM_TYPE_SCORE_MAP.get(507);
        }
        map.put("ALARM_507_NO_AVG",String.format("%.2f",ALARM_507_NO_AVG));
        map.put("ALARM_507_NO_SCORE",String.format("%.2f",ALARM_507_NO_SCORE));

        Double ALARM_508_NO_100 = Integer.parseInt(map.get("ALARM_508_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_508_NO_L2_100 = Integer.parseInt(map.get("ALARM_508_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_508_NO_100",String.format("%.2f",ALARM_508_NO_100));
        map.put("ALARM_508_NO_L2_100",String.format("%.2f",ALARM_508_NO_L2_100));
        Double ALARM_508_NO_AVG = Integer.parseInt(map.get("ALARM_508_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_508_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_508_NO_SCORE = 0d;
        if(ALARM_508_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(508)<0) {
            ALARM_508_NO_SCORE = (1 - ALARM_508_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(508)) * Constants.ALARM_TYPE_SCORE_MAP.get(508);
        }
        map.put("ALARM_508_NO_AVG",String.format("%.2f",ALARM_508_NO_AVG));
        map.put("ALARM_508_NO_SCORE",String.format("%.2f",ALARM_508_NO_SCORE));

        Double ALARM_509_NO_100 = Integer.parseInt(map.get("ALARM_509_NO").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_509_NO_L2_100 = Integer.parseInt(map.get("ALARM_509_NO_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_509_NO_100",String.format("%.2f",ALARM_509_NO_100));
        map.put("ALARM_509_NO_L2_100",String.format("%.2f",ALARM_509_NO_L2_100));
        Double ALARM_509_NO_AVG = Integer.parseInt(map.get("ALARM_509_NO").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_509_NO_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_509_NO_SCORE = 0d;
        if(ALARM_509_NO_AVG-Constants.ALARM_TYPE_CRITICAL_MAP.get(509)<0) {
            ALARM_509_NO_SCORE = (1 - ALARM_509_NO_AVG / Constants.ALARM_TYPE_CRITICAL_MAP.get(509)) * Constants.ALARM_TYPE_SCORE_MAP.get(509);
        }
        map.put("ALARM_509_NO_AVG",String.format("%.2f",ALARM_509_NO_AVG));
        map.put("ALARM_509_NO_SCORE",String.format("%.2f",ALARM_509_NO_SCORE));
        Double ALARM_NUM_NO_AVG = Integer.parseInt(map.get("ALARM_NUM").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_NUM_L2_NO_AVG = Integer.parseInt(map.get("ALARM_NUM_L2").toString())*100/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        Double ALARM_COUNT_NO_AVG = Integer.parseInt(map.get("ALARM_NUM").toString())*100*0.5/Double.parseDouble(map.get("TOTALMILEAGE").toString()) + Integer.parseInt(map.get("ALARM_NUM_L2").toString())*100*1.5/Double.parseDouble(map.get("TOTALMILEAGE").toString());
        map.put("ALARM_NUM_NO_AVG",String.format("%.2f",ALARM_NUM_NO_AVG));
        map.put("ALARM_NUM_L2_NO_AVG",String.format("%.2f",ALARM_NUM_L2_NO_AVG));
        map.put("ALARM_COUNT_NO_AVG",String.format("%.2f",ALARM_COUNT_NO_AVG));
        map.put("SCORE_COUNT", String.format("%.2f",(ALARM_501_NO_SCORE+ALARM_502_NO_SCORE+ALARM_503_NO_SCORE+ALARM_504_NO_SCORE+ALARM_505_NO_SCORE+ALARM_506_NO_SCORE+ALARM_507_NO_SCORE+ALARM_508_NO_SCORE+ALARM_509_NO_SCORE)));
    }
}
