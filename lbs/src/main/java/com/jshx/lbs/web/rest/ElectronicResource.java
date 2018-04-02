package com.jshx.lbs.web.rest;
import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.ElectronicService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
@RestController
@RequestMapping("/api")
public class ElectronicResource {

    @Resource
    private ElectronicService electronicService;

    private final Logger log = LoggerFactory.getLogger(SysRoleLbsResource.class);

    private static final String ENTITY_NAME = "electronic";

    @PostMapping("/getElectronicInfo")
    @Timed
    @ResponseBody
    public List getElectronicInfo()
    {
        return electronicService.getElectronicInfo();
    }

    @PostMapping("/saveElectronic")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveElectronic(@RequestParam(value = "efname", required = false) String efname,
                                            @RequestParam(value = "efStartTime", required = false) String efStartTime,
                                            @RequestParam(value = "efEndTime", required = false) String efEndTime,
                                            @RequestParam(value = "alarmType", required = false) String alarmType,
                                            @RequestParam(value = "timeSpan", required = false) String timeSpan,
                                            @RequestParam(value = "speedlimit", required = false) String speedlimit,
                                            @RequestParam(value = "areatype", required = false) String areatype,
                                            @RequestParam(value = "ewidth", required = false) String ewidth,
                                            @RequestParam(value = "eon", required = false) String eon,
                                            @RequestParam(value = "isdisp", required = false) String isdisp
                                        )
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(efname)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入efname为空");
            return baseReturnMessage;
    }
        return  electronicService.saveElectronic(efname,efStartTime,efEndTime,alarmType,timeSpan,speedlimit,
            areatype,ewidth,eon, isdisp,baseReturnMessage);
    }



    @PostMapping("/delElectronic")
    @Timed
    @ResponseBody
    public  BaseReturnMessage  delElectronic(@RequestParam(value = "efId", required = false) String efId)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(efId)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入efId为空");
            return baseReturnMessage;
        }
        return electronicService.delElectronic(efId,baseReturnMessage);
    }


    @PostMapping("/updateElectronic")
    @Timed
    @ResponseBody
    public BaseReturnMessage updateElectronic(@RequestParam(value = "efId", required = false) String efId,
                                              @RequestParam(value = "efname", required = false) String efname,
                                              @RequestParam(value = "efStartTime", required = false) String efStartTime,
                                              @RequestParam(value = "efEndTime", required = false) String efEndTime,
                                              @RequestParam(value = "alarmType", required = false) String alarmType,
                                              @RequestParam(value = "timeSpan", required = false) String timeSpan,
                                              @RequestParam(value = "speedlimit", required = false) String speedlimit,
                                              @RequestParam(value = "areatype", required = false) String areatype,
                                              @RequestParam(value = "ewidth", required = false) String ewidth,
                                              @RequestParam(value = "eon", required = false) String eon,
                                              @RequestParam(value = "areaoutalarmToP", required = false) String areaoutalarmToP,
                                              @RequestParam(value = "areaoutalarmToD", required = false) String areaoutalarmToD,
                                              @RequestParam(value = "areainalarmToP", required = false) String areainalarmToP,
                                              @RequestParam(value = "areainalarmToD", required = false) String areainalarmToD,
                                              @RequestParam(value = "areasetSpeed", required = false) String areasetSpeed,
                                              @RequestParam(value = "AreaId", required = false) String AreaId,
                                              @RequestParam(value = "arealonSet", required = false) String arealonSet,
                                              @RequestParam(value = "arealatSet", required = false) String arealatSet,
                                              @RequestParam(value = "areaStartTime", required = false) String areaStartTime,
                                              @RequestParam(value = "areaEndTime", required = false) String areaEndTime,
                                              @RequestParam(value = "speedOn", required = false) String speedOn,
                                              @RequestParam(value = "overTime", required = false) String overTime,
                                              @RequestParam(value = "isdisp", required = false) String isdisp)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(efId)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入efId为空");
            return baseReturnMessage;
        }
        return  electronicService.updateElectronic(efId,efname,efStartTime,efEndTime,alarmType,timeSpan,speedlimit,
                             areatype,ewidth,eon, areaoutalarmToP,areaoutalarmToD,areainalarmToP,areainalarmToD,areasetSpeed,
            AreaId,arealonSet,arealatSet ,areaStartTime,areaEndTime,speedOn,overTime,isdisp,baseReturnMessage);
    }

    @PostMapping("/setElectCar")
    @Timed
    @ResponseBody
    public BaseReturnMessage setElectCar(@RequestParam(value = "efId", required = false) String efId,
                                        @RequestParam(value = "carIdList", required = false) List carIdList)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(efId)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入efId为空");
            return baseReturnMessage;
        }
        return  electronicService.setElectCar(efId,carIdList,baseReturnMessage);
    }

}
