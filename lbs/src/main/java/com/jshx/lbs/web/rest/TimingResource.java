package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.DriverService;
import com.jshx.lbs.service.TimingService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TimingResource {
    @Resource
    private TimingService timingService;

    @PostMapping("/getTimimgInfo")
    @Timed
    @ResponseBody
    public List getTimimgInfo(
        @RequestParam(value = "serviceName", required = false) String serviceName,
        @RequestParam(value = "startTime", required = false) String startTime
    ){
        List<Map>list = timingService.getTimingInfo(serviceName,startTime);
        if(list!=null && list.size()>0){
            for(Map<String,Object>map : list){
                map.put("serviceId",map.get("SERVICE_ID"));
                map.put("serviceName",map.get("SERVICE_NAME"));
                map.put("startTime",map.get("START_TIME"));
                map.put("timeSpan",map.get("TIME_SPAN"));
                map.put("photoNum",map.get("PHOTO_NUM"));
                map.put("channelIds",map.get("CHANNEL_IDS"));
            }
        }
        return list;
    }

    @PostMapping("/saveTimingInfo")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveTimingInfo(
        @RequestParam(value = "serviceName", required = false) String serviceName,
        @RequestParam(value = "startTime", required = false) String startTime,
        @RequestParam(value = "timeSpan", required = false) String timeSpan,
        @RequestParam(value = "photoNum", required = false) String photoNum,
        @RequestParam(value = "channelIds", required = false) String channelIds,
        @RequestParam(value = "carIdList", required = false) List carIdList
    ){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("companyId",companyId);
        paramMap.put("serviceId", UUID.randomUUID().toString());
        paramMap.put("serviceName",serviceName);
        paramMap.put("startTime",startTime);
        paramMap.put("timeSpan",timeSpan);
        paramMap.put("photoNum",photoNum);
        paramMap.put("channelIds",channelIds);
        paramMap.put("carIdList",carIdList);
        paramMap.put("imgType","jpg");
        paramMap.put("imgSize",1);
        try {
         timingService.saveTimingInfo(paramMap);
        }catch (Exception e){
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("系统异常,请稍后再试");
        }
        return baseReturnMessage;
    }

    @PostMapping("/updateTimingInfo")
    @Timed
    @ResponseBody
    public BaseReturnMessage updateTimingInfo(
        @RequestParam(value = "serviceId", required = true) String serviceId,
        @RequestParam(value = "serviceName", required = false) String serviceName,
        @RequestParam(value = "startTime", required = false) String startTime,
        @RequestParam(value = "timeSpan", required = false) String timeSpan,
        @RequestParam(value = "photoNum", required = false) String photoNum,
        @RequestParam(value = "channelIds", required = false) String channelIds,
        @RequestParam(value = "carIdList", required = false) List carIdList
    ){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        paramMap.put("companyId",companyId);
        paramMap.put("serviceId",serviceId);
        paramMap.put("serviceName",serviceName);
        paramMap.put("startTime",startTime);
        paramMap.put("timeSpan",timeSpan);
        paramMap.put("photoNum",photoNum);
        paramMap.put("carIdList",carIdList);
        paramMap.put("channelIds",channelIds);
        paramMap.put("imgType","jpg");
        paramMap.put("imgSize",1);
        try {
            timingService.updateTimingInfo(paramMap,serviceId);
            baseReturnMessage.setResult(Constants.SUCCESS);
        }catch (Exception e){
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("系统异常,请稍后再试");
        }
        return baseReturnMessage;
    }

    @PostMapping("/deleteTimingInfo")
    @Timed
    @ResponseBody
    public BaseReturnMessage deleteTimingInfo(
        @RequestParam(value = "serviceId", required = true) String serviceId
    ){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        try {
         timingService.deleteTimingInfo(serviceId);
        }catch (Exception e){
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("系统异常,请稍后再试");
        }
        return baseReturnMessage;
    }

    @PostMapping("/setCarIdListByServiceId")
    @Timed
    @ResponseBody
    public BaseReturnMessage setCarIdListByServiceId( @RequestParam (value = "serviceId", required = true)String serviceId,
                                         @RequestParam (value = "carIdList", required = true)List carIdList
    ){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        try {
            timingService.setCarIdListByServiceId(serviceId,carIdList);
        }catch (Exception e){
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("系统异常,请稍后再试");
        }
        return baseReturnMessage;
    }

    @PostMapping("/getCarIdListByServiceId")
    @Timed
    @ResponseBody
    public List getCarIdListByServiceId( @RequestParam (value = "serviceId", required = true)String serviceId){
         List<Map>list = timingService.getCarIdListByServiceId(serviceId);
         if(list!=null&&list.size()>0){
             return list;
         }else{
             return new ArrayList();
         }

    }
}
