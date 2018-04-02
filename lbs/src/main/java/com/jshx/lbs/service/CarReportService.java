package com.jshx.lbs.service;

import java.util.HashMap;
import java.util.List;

public interface CarReportService {

    public List getCarReportDay(String keyId,String startTime, String endTime);
    public List getCarHisData(String keyId,String startTime, String endTime);
    public List<HashMap<String, Object>> getCarHisStopData(String keyId, String startTime, String endTime);
    public List QueryCarTraceByTime(String keyId,String startTime, String endTime);
    public List getCarDriverStatus(String keyId);
}
