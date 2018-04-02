package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface TimingMapper {
    public List getTimingInfo(Map map);
    public void saveTimingInfo(Map paramMap);
    public void updateTimingInfo(Map paramMap);
    public void deleteTimingInfo(String serviceId);
    public List getCarIdListByServiceId(String serviceId);
    public void saveCarIdForServieId(Map paramMap);
    public void deleteByServiceId(String serviceId);
}
