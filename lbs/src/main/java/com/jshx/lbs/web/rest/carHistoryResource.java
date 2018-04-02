package com.jshx.lbs.web.rest;


import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.HisData;
import com.jshx.lbs.repository.CarHistoryRepository;
import com.jshx.lbs.security.SecurityUtils;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.net.URLDecoder;


@RestController
@RequestMapping("/api")
public class carHistoryResource {

    private final Logger log = LoggerFactory.getLogger(carHistoryResource.class);

    private final CarHistoryRepository carHistoryRepository;

    private String key_Id = "";

    public carHistoryResource(CarHistoryRepository carHistoryRepository) {
        this.carHistoryRepository=carHistoryRepository;

    }


    @PostMapping("/getCarHistoryInfo")
    @Timed
    @ResponseBody
    public String getCarHistoryInfo(@RequestParam(value = "keyId", required = false) String keyId,
                                   @RequestParam(value = "carNo", required = false) String carNo,
                                   @RequestParam(value = "startTime", required = false) String startTime,
                                   @RequestParam(value = "endTime", required = false) String endTime
                                   ){
        HisData hisData = new HisData();
        try {
            carNo = URLDecoder.decode(carNo, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
//        List<Object[]> resultList = carHistoryRepository.findCarHistoryInfo(keyId,startTime,endTime);
        String userName = SecurityUtils.getCurrentUserLogin();

        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        if(StringUtils.isBlank(userName)||StringUtils.isBlank(companyId)){
            return null;
        }
        List<Object[]> resultList = null;
        if(StringUtils.isNotEmpty(keyId)){
            List<Object> list = carHistoryRepository.CheckuserCarBykeyId(keyId,userName,companyId);
            if(list.size()>0){
                resultList = carHistoryRepository.findCarHistoryInfo(keyId,startTime,endTime);
            }

            key_Id = keyId;
        }else if(StringUtils.isNotEmpty(carNo)){
            List<Object> list = carHistoryRepository.CheckuserCarByCarNo(carNo,userName,companyId);
            if(list.size()>0) {
                List<String> keyids = carHistoryRepository.findKeyIdByCarNo(carNo);
                if(keyids == null || keyids.size()>1){
                    HisData newHisData = new HisData();
                    newHisData.setResultCode(1);
                    newHisData.setMessage("无效车牌");
                    String wrongResult = JSONObject.fromObject(hisData).toString();
                    return wrongResult;
                }else{
                    resultList = carHistoryRepository.findCarHistoryInfo(keyids.get(0),startTime,endTime);
                    key_Id = keyids.get(0);
                }
            }
        }else{
            return null;
        }

        List<HashMap<String, Object>> ListMap =  new ArrayList<HashMap<String,Object>>();

        //轨迹数据信息
        List<HashMap<String, Object>> carHisList =  new ArrayList<HashMap<String,Object>>();
        //停留点数据信息
        List<HashMap<String, Object>> stopData =  new ArrayList<HashMap<String,Object>>();
        //报警数据信息
        List<HashMap<String, Object>> alarmData =  new ArrayList<HashMap<String,Object>>();

        if(resultList != null && resultList.size()!=0){
            for (Object[] object : resultList) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("keyId", object[0]+"");//keyid
                map.put("lat", object[1]+"");//纬度
                map.put("lon", object[2]+"");//经度
               // map.put("timeToBegin", object[3]+"");//距离起点时长
                map.put("speed", object[3]+"");//速度
                map.put("distance", object[4]+"");//距离
                map.put("direction", object[5]+"");//方向
                map.put("time", object[6]+"");//定位时间
             //   map.put("stopPoint", object[8]+"");//停留点
                ListMap.add(map);
            }
            boolean tag = false;
            // 对数据为零的记录去重复项
            for (int i = 0; i < ListMap.size(); i++) {
                HashMap<String, Object> carData=ListMap.get(i);
                if (Double.valueOf(carData.get("speed")+"") > 0.0) {
                    carHisList.add(carData);
                    tag = false;
                } else {
                    if (!tag) {
                        tag = true;
                        carHisList.add(carData);
                    }
                }
            }
            if(carHisList.size()>0){
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                double initdistance= Double.valueOf(carHisList.get(0).get("distance")+"");
                HashMap<String, Object> previousCarMap = new HashMap<String, Object>();
                Double currentDis = 0.0 ;
                for(int i=0; i < carHisList.size(); i++){
                    try {
                        HashMap<String, Object> carMap=carHisList.get(i);
                        //停留信息
                        HashMap<String, Object> stopMap=new HashMap<String, Object>();

                        //当前时间点的里程数
                        currentDis =  Double.valueOf(carMap.get("distance")+"");

                        String previousDate="";
                        if(i==0){
                            previousDate=carHisList.get(0).get("time")+"";
                        }else{
                            previousDate=carHisList.get(i-1).get("time")+"";
                        }
                        Date f= df.parse(carHisList.get(0).get("time")+"");//起点时间
                        Date p= df.parse(previousDate);//前一个点的时间
                        Date d= df.parse(carMap.get("time")+"");//当前点的时间
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(f);
                        long firstTime=cal.getTimeInMillis();
                        cal.setTime(p);
                        long previousTime=cal.getTimeInMillis();
                        cal.setTime(d);
                        long currentTime=cal.getTimeInMillis();
                        Integer lastTime=(int) ((currentTime-previousTime)/1000);
                        String lastStr="";
                        if(lastTime<60){
                            if(lastTime==0){
                                lastStr="1秒";
                            }else{
                                lastStr=lastTime+"秒";
                            }
                        }else{
                            if(lastTime<3600){
                                int floor = (int)Math.floor(lastTime/60);
                                int ny = lastTime%60;
                                lastStr= floor+"分"+ny+"秒";
                            }else{
                                int floor = (int)Math.floor(lastTime/3600);
                                int ny = lastTime%3600;
                                int floor1 = (int)Math.floor(ny/60);
                                int ny1 = ny%60;
                                lastStr=floor+"小时"+floor1+"分"+ny1+"秒";
                            }
                        }
                        carMap.put("timeToBegin", ((double)(currentTime-firstTime)/3600000)*10);//距离起点时长
                        carMap.put("stopTime",lastStr);

                        //停留时间大于3分钟则记录为停留点
                        if(lastTime > 180)
                        {
                            //停留时间
                            stopMap.put("stopTime",lastStr);
                            //停留点
                            stopMap.put("lon",carMap.get("lon"));
                            stopMap.put("lat",carMap.get("lat"));
                            stopData.add(stopMap);
                        }

                        if(Double.valueOf(carHisList.get(i).get("speed")+"")==0.0){ //速度为0的点标记为停留点
                            carMap.put("stopPoint", 1);
                        }else{
                            carMap.put("stopPoint", 0);
                        }

                        carHisList.get(i).put("distance", String.valueOf((currentDis-initdistance)/1000));

                        if(i > 0)
                        {
                            if(Double.valueOf(String.valueOf(carHisList.get(i).get("distance"))) <
                                Double.valueOf(String.valueOf(carHisList.get(i-1).get("distance"))))
                            {
                                carHisList.get(i).put("distance", String.valueOf(carHisList.get(i-1).get("distance")));
                            }
                        }


//	                                BigDecimal latitude=(BigDecimal) carMap.get("L");
//	                                BigDecimal longitude=(BigDecimal) carMap.get("O");

	                                /*double[] xy=MapCoordFix.Fix(longitude.doubleValue(),latitude.doubleValue());
	                                if(null !=xy&&xy.length==2){
	                                    carMap.put("O", String.valueOf(xy[0]));
	                                    carMap.put("L", String.valueOf(xy[1]));
	                                }else{
	                                    carMap.put("O", String.valueOf(longitude));
	                                    carMap.put("L", String.valueOf(latitude));
	                                }*/
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    // return carHisList;

                }
            }else{
                hisData.setResultCode(1);
                hisData.setMessage("未查询到此车辆信息");
            }
        }else{
            hisData.setResultCode(1);
            hisData.setMessage("未查询到此车辆信息");
        }

        //查询报警数据
        List<Object[]> alarmList = new ArrayList<Object[]>();
        alarmList = carHistoryRepository.queryAlarmData(key_Id,startTime,endTime);

        for (Object[] object : alarmList) {
            HashMap<String, Object> map = new HashMap<String, Object>();
            map.put("alarm_date", object[0]+"");
            map.put("alarminfo_longitude", object[1]+"");
            map.put("alarminfo_latitude", object[2]+"");
            map.put("alarm_desc", object[3]+"");
            map.put("alarm_type", object[4]+"");
            alarmData.add(map);
        }

        for(int i=0;i<alarmData.size();i++)
        {
            HashMap<String, Object> currentAlarmMap = alarmData.get(i);
            Calendar cal = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            //当前报警描述
            String currentType = "";
            //前一个报警描述
            String previousType = "";
            Date currentDate = new Date();
            long currentTime = 0;
            try {
                //当前报警时间
                currentDate= sdf.parse(currentAlarmMap.get("alarm_date")+"");
                cal.setTime(currentDate);
                currentTime = cal.getTimeInMillis();
            } catch (ParseException e) {
                e.printStackTrace();
            }

            if(i > 0)
            {
                HashMap<String, Object> previousAlarmMap = alarmData.get(i-1);
                currentType = (String)currentAlarmMap.get("alarm_type");
                previousType = (String)previousAlarmMap.get("alarm_type");
                //前一个报警时间
                long previousTime = 0;
                if(currentType != null && previousType != null)
                {
                    try {
                        Date previousDate= sdf.parse(previousAlarmMap.get("alarm_date")+"");
                        cal.setTime(previousDate);
                        previousTime = cal.getTimeInMillis();
                        Integer minusTime=(int) ((currentTime-previousTime)/1000);
                        if(currentType.equals(previousType) && minusTime < 60)
                        {
                            //满足条件则删除该重复数据
                            alarmData.remove(i);
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

            }

        }
        if(hisData.getMessage() == null || hisData.getMessage() == "")
        {
            hisData.setMessage("查询成功");
        }
        if(hisData.getResultCode() == 1)
        {
            hisData.setResultCode(1);
        }else
        {
            hisData.setResultCode(0);
        }
        hisData.setCarHisList(carHisList);
        hisData.setStopData(stopData);
        hisData.setAlarmData(alarmData);
        JSONObject resultJsonData = JSONObject.fromObject(hisData);
        String resStr = resultJsonData.toString();

        return resStr;
    }
}
