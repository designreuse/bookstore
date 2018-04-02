package com.jshx.lbs.service;

import java.util.List;
import java.util.Map;

public interface OperateLogService {
    public List<Map> getOperateType();
    public List<Map> searchOperateLog(String userName,String opetype, String startTime, String endTime);
    public List<Map> searchOperateLogSum(String userName,String opetype, String startTime, String endTime);

    public List<Map> searchLoginLog(String userName,String opetype, String startTime, String endTime);
}
