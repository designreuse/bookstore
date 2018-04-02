package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ElectronicService {

    public List<Map> getElectronicInfo();
    public BaseReturnMessage saveElectronic(String efname, String efStartTime, String efEndTime,
                                            String alarmType, String timeSpan, String speedlimit,
                                            String areatype, String ewidth,String eon, String isdisp, BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delElectronic(String efId,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updateElectronic(String efId,String efname, String efStartTime, String efEndTime,
                                              String alarmType, String timeSpan, String speedlimit,
                                              String areatype, String ewidth,String eon,
                                              String areaoutalarmToP,String areaoutalarmToD,String areainalarmToP,
                                              String areainalarmToD,String areasetSpeed,String AreaId,
                                              String arealonSet,String arealatSet,String areaStartTime,String areaEndTime,
                                              String speedOn,String overTime, String isdisp, BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage setElectCar(String efId,List carIdList,BaseReturnMessage baseReturnMessage);
}
