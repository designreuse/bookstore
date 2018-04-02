package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.DriverService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DriverResource {
    @Resource
    private DriverService driverService;

    @PostMapping("/getDriverComparaInfo")
    @Timed
    @ResponseBody
    public List getDriverComparaInfo(@RequestParam(value = "startTime", required = false) String startTime,
                            @RequestParam(value = "endTime", required = false)String endTime,
                            @RequestParam(value = "dealResult", required = false)String dealResult){
        return driverService.getDriverComparaInfo(startTime,endTime,dealResult);
    }

    @PostMapping("/dealDriverCompara")
    @Timed
    @ResponseBody
    public BaseReturnMessage dealDriverCompara(@RequestParam(value = "id", required = false) String id,
                                               @RequestParam(value = "dealUser", required = false)String dealUser,
                                               @RequestParam(value = "dealResult", required = false)int dealResult,
                                               @RequestParam(value = "dealContent", required = false)String dealContent){
        return driverService.dealDriverCompara(id,dealUser,dealResult,dealContent);
    }

    @PostMapping("/getDriverComparaInfoById")
    @Timed
    @ResponseBody
    public List getDriverComparaInfoById(@RequestParam(value = "id", required = true) String id){
        return driverService.getDriverComparaInfoById(id);
    }
}
