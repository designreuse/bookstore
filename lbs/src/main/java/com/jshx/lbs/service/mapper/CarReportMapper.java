package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface CarReportMapper {
    List<Map> getCarReportDay(Map map);
    List<Map> getCarHisData(Map map);
    List<Map> getCarTripReport(Map map);
    List<Map> getCarDriverStatus(String keyId);
    List<Map> getCarDriveBehavior(Map map);
    List<Map> getIsCarObd(String keyId);
    List<Map> getTripReport(Map map);

}
