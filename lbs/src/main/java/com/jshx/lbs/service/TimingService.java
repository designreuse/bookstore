package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface TimingService {
    public List getTimingInfo(String serviceName,String startTime);
    public void saveTimingInfo(Map paramMap);
    public void updateTimingInfo(Map paramMap,String serviceId);
    public void deleteTimingInfo(String serviceId);
    public List getCarIdListByServiceId(String serviceId);
    public void setCarIdListByServiceId(String serviceId,List carIdList);
}
