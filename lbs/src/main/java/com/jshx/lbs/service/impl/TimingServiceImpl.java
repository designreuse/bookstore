package com.jshx.lbs.service.impl;

import com.jshx.lbs.service.TimingService;
import com.jshx.lbs.service.mapper.TimingMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service("timingService")
public class TimingServiceImpl implements TimingService {

    @Resource
    private TimingMapper timingMapper;


    @Override
    public List getTimingInfo(String serviceName, String startTime) {
        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("serviceName",serviceName);
        paramMap.put("startTime",startTime);
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("companyId",companyId);
        return   timingMapper.getTimingInfo(paramMap);
    }

    @Override
    public void saveTimingInfo(Map paramMap) {
        timingMapper.saveTimingInfo(paramMap);
        if(paramMap.get("carIdList")!=null && ((List)paramMap.get("carIdList")).size()>0) {
            timingMapper.saveCarIdForServieId(paramMap);
        }
    }

    @Override
    public void updateTimingInfo(Map paramMap,String serviceId) {
        timingMapper.updateTimingInfo(paramMap);
        if(paramMap.get("carIdList")!=null && ((List)paramMap.get("carIdList")).size()>0) {
            timingMapper.saveCarIdForServieId(paramMap);
        }
    }

    @Override
    public void deleteTimingInfo(String serviceId) {
        timingMapper.deleteTimingInfo(serviceId);
        timingMapper.deleteByServiceId(serviceId);
    }

    @Override
    public List getCarIdListByServiceId(String serviceId) {
        return timingMapper.getCarIdListByServiceId(serviceId);
    }

    @Override
    public void setCarIdListByServiceId(String serviceId, List carIdList) {
        if(carIdList!=null && carIdList.size()>0){
            timingMapper.deleteByServiceId(serviceId);
            for(Object carId : carIdList){
                Map<String,Object> paramMap = new HashMap<String,Object>();
                paramMap.put("serviceId",serviceId);
                paramMap.put("carId",carId);
                timingMapper.saveCarIdForServieId(paramMap);
            }
        }
    }

}
