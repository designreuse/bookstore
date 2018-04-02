package com.jshx.lbs.web.rest.util;

import com.jshx.lbs.service.mapper.AlarmMapper;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AlarmUtil {
    public static List<Map> getAlarmTypeInfo(AlarmMapper alarmMapper,String companyId){
        Map<String,Object>paramMap = new HashMap<String,Object>();
        List<Map>returnMap =new ArrayList<Map>();
        paramMap.put("companyId",companyId);
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
                map1.put("alarmType",map.get("ALARMTYPEID"));
                if(StringUtils.isNotBlank(map.get("SETNAME").toString())){
                    map1.put("name",map.get("SETNAME").toString());
                }else if (StringUtils.isBlank(map.get("DEFAULTNAME").toString())){
                    map1.put("name",map.get("DEFAULTNAME"));
                }else{
                    map1.put("name","");
                }
            }
            returnMap.add(map1);
        }
        return returnMap;
    }
}
