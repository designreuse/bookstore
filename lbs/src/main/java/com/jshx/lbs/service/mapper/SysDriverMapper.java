package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface SysDriverMapper {
    List<Map> getDriverInfo(String companyId);
    List<Map> queryDriver(String d_name);
    List<Map> queryRepeatDriverInfo(String companyid,String d_name);
    List<Map> queryRepeatUpdDriverInfo(String companyid,String  d_id,String d_name);
    List<Map> queryRepeatDriverIC(String d_icnumber);
    List<Map> queryRepeatUpdDriverIC(String  d_id,String d_icnumber);
    int updDriverCar(String  d_id);
    int saveDriver(Map map);
    int delDriverInfo(String  d_id);
    int updDriverInfo(Map map);
}
