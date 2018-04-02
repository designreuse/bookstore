package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.service.mapper.CarReportMapper;
import com.jshx.lbs.web.rest.util.AddressUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jshx.lbs.service.CarReportService;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Calendar;

@Transactional
@Service("CarReportService")
public class CarReportServiceImpl implements CarReportService {
    @Resource
    private CarReportMapper carReportMapper;


    @Override
    public List getCarReportDay(String keyId, String startTime, String endTime) {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("keyid", keyId);
        paramMap.put("startTime", startTime);
        paramMap.put("endTime", endTime);
        return carReportMapper.getCarReportDay(paramMap);
    }

    @Override
    public List getCarHisData(String keyId, String startTime, String endTime) {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("keyid", keyId);
        paramMap.put("startTime", startTime);
        paramMap.put("endTime", endTime);
        return carReportMapper.getCarHisData(paramMap);
    }

    @Override
    public List<HashMap<String, Object>> getCarHisStopData(String keyId, String startTime, String endTime) {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("keyid", keyId);
        paramMap.put("startTime", startTime);
        paramMap.put("endTime", endTime);

        List<HashMap<String, Object>> ListMap = new ArrayList<HashMap<String, Object>>();
        //轨迹数据信息
        List<HashMap<String, Object>> carHisList = new ArrayList<HashMap<String, Object>>();
        //停留点数据信息
        List<HashMap<String, Object>> stopData = new ArrayList<HashMap<String, Object>>();

        List<Map> resultList = carReportMapper.getCarHisData(paramMap);
        if(resultList != null && resultList.size()!=0){

            for (Map<String, Object> mapResult : resultList) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                for (Map.Entry<String, Object> m : mapResult.entrySet()) {
                    if(m.getKey().equals("keyid"))
                    {
                        map.put("keyId", m.getValue()+"");//纬度
                    }
                    if(m.getKey().equals("MSG_LATITUDE"))
                    {
                        map.put("lat", m.getValue()+"");//纬度
                    }
                    if(m.getKey().equals("MSG_LONGITUDE"))
                    {
                        map.put("lon", m.getValue()+"");//经度
                    }
                    if(m.getKey().equals("MSG_SPEED"))
                    {
                        map.put("speed", m.getValue()+"");//速度
                    }
                    if(m.getKey().equals("MSG_DISTANCE"))
                    {
                        map.put("distance", m.getValue()+"");//距离
                    }
                    if(m.getKey().equals("MSG_DIRECTION"))
                    {
                        map.put("direction", m.getValue()+"");//方向
                    }
                    if(m.getKey().equals("MSG_TIME_NEW"))
                    {
                        map.put("time", m.getValue()+"");//定位时间
                    }
                }
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
                int j=0;
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
                        if(lastTime > 30)//180
                        {
                            //停留时间
                            j++;
                            stopMap.put("pIndex","P"+j);

                            stopMap.put("StopStartTime",previousDate);
                            stopMap.put("StopEndTime",carMap.get("time"));
                            stopMap.put("stopTime",lastStr);
                            //停留点
                            stopMap.put("lon",carMap.get("lon"));
                            stopMap.put("lat",carMap.get("lat"));
                            stopMap.put("location",AddressUtil.getAddress(carMap.get("lon").toString(),carMap.get("lat").toString()));
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

                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return stopData;
    }

    @Override
    public List QueryCarTraceByTime(String keyId, String startTime, String endTime) {

        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("keyid", keyId);
        paramMap.put("startTime", startTime);
        paramMap.put("endTime", endTime);

        List<Map> tripReportList = carReportMapper.getCarTripReport(paramMap);
        //数据结构
        Date tempEndTime = new Date();
        List<HashMap<String, Object>> ListMap = new ArrayList<HashMap<String, Object>>();
        if(tripReportList != null && tripReportList.size()!=0) {

            for (Map<String, Object> mapResult : tripReportList) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm");
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String begintime = "";
                String endtime = "";
                for (Map.Entry<String, Object> m : mapResult.entrySet()) {
                    if (m.getKey().equals("BeginTime")) {
                        begintime = sdf.format(m.getValue());

                        Date tempbeginTime = null;
                        try {
                            tempbeginTime = df.parse(begintime);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        //计算StopTime
                        endtime = sdf.format(tempEndTime);
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(tempbeginTime);
                        long previousTime=cal.getTimeInMillis();
                        cal.setTime(tempEndTime);
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
                        map.put("StopTime",lastStr);
                    }

                    if (m.getKey().equals("EndTime")) {
                        endtime = sdf.format(m.getValue());
                    }
                    //根据行程报告查询轨迹
                    Map<String, Object> paramHismap = new HashMap<String, Object>();
                    paramHismap.put("keyid", keyId);
                    paramHismap.put("startTime", begintime);
                    paramHismap.put("endTime", endtime);
                    //计算时间段内的开始点和结束点位置
                    String strStartPlace = "";
                    String strEndPlace = "";
                    String strLongitude = "";
                    String strLatitude = "";
                    List<Map> carHisList = carReportMapper.getCarHisData(paramHismap);
                    if(carHisList != null && carHisList.size()!=0)
                    {
                        Map<String, Object> carDatast = carHisList.get(0);
                        Map<String, Object> carDataed = carHisList.get(carHisList.size()-1);
                        strLongitude = carDatast.get("MsgLongitude").toString();
                        strLatitude = carDatast.get("MsgLatitude").toString();
                        strStartPlace = AddressUtil.getAddress(strLongitude,strLatitude);
                        strEndPlace = AddressUtil.getAddress(carDataed.get("MsgLongitude").toString(),carDataed.get("MsgLatitude").toString());
                    }
                    map.put("MsgLongitude",strLongitude);
                    map.put("MsgLatitude",strLatitude);
                    map.put("BeginTime",begintime);
                    map.put("StartPlace",strStartPlace);
                    map.put("EndTime",endtime);
                    map.put("ArrivePlace",strEndPlace);
                    Double tripmile = 0.0;
                    Double tripoil = 0.0;
                    Double tripavgspeed = 0.0;
                    if (m.getKey().equals("TripMileage")) {
                        tripmile = Double.valueOf(m.getValue().toString());
                        map.put("TripMileage",tripmile);
                    }
                    if (m.getKey().equals("TripOil")) {
                        tripoil = Double.valueOf(m.getValue().toString());
                        map.put("TripOil",tripoil);
                    }
                    Double oil_average = 0.0;
                    if (tripmile != 0.0) {
                        oil_average = tripoil / tripmile * 100;//oil_average.ToString("N1")
                        map.put("TripOilAvg",tripoil);
                    }
                    if (m.getKey().equals("SpeedAverage")) {
                        tripavgspeed = Double.valueOf(m.getValue().toString());
                        map.put("TripAvgSpeed",tripavgspeed);
                    }
                    //驾驶行为
                    List<Map> carDriverList = carReportMapper.getCarDriveBehavior(paramHismap);
                    if(carDriverList != null && carDriverList.size()!=0)
                    {
                        Map<String, Object> carDriver = carDriverList.get(0);
                        map.put("QuickStart",Double.valueOf(carDriver.get("QuickStart").toString()));
                        map.put("QuickStop",Double.valueOf(carDriver.get("QuickStop").toString()));
                        map.put("SharpTurn",Double.valueOf(carDriver.get("SharpTurn").toString()));
                        map.put("HighSpeed",Double.valueOf(carDriver.get("HighSpeed").toString()));
                        map.put("SpeedNotEqual",Double.valueOf(carDriver.get("SpeedNotEqual").toString()));
                        map.put("LongIdle",Double.valueOf(carDriver.get("LongIdle").toString()));
                        map.put("NeuTaxing",Double.valueOf(carDriver.get("NeuTaxing").toString()));
                    }
                }
                ListMap.add(map);
            }
        }
        return ListMap;
    }

    @Override
    public List getCarDriverStatus(String keyId) {
        HashMap<String, Object> map = new HashMap<String, Object>();
        List<Map> carDriverList = carReportMapper.getCarDriverStatus(keyId);
        if(carDriverList != null && carDriverList.size()!=0) {
            Map<String, Object> carDriver = carDriverList.get(0);
            if(carDriver.get("available")==null)
            {
                map.put("CarIsObd",0);
            }
            else
            {
                map.put("CarIsObd",carDriver.get("available").toString());
            }
        }
        else {
            map.put("CarIsObd",0);
        }
        return null;
    }


}

