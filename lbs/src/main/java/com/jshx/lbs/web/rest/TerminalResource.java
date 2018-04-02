package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.service.TerminalService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TerminalResource {
    @Resource
    private TerminalService terminalService;

    @PostMapping("/getTerminal")
    @Timed
    @ResponseBody
    public List getTerminal(@RequestParam(value = "softVersion", required = false) String softVersion,
                            @RequestParam(value = "startTime", required = false)String startTime,
                            @RequestParam(value = "endTime", required = false)String endTime,
                            @RequestParam(value = "keyIdList", required = false)List keyIdList,
                            @RequestParam(value = "deviceId", required = false)String deviceId,
                            @RequestParam(value = "softVesion", required = false)String softVesion
                           ){
        int deviceIdInt = -1;
        if(StringUtils.isNumeric(deviceId)){
            deviceIdInt = Integer.parseInt(deviceId);
        }
        return terminalService.getTerminal(softVersion,startTime,endTime,keyIdList,deviceIdInt,softVesion);
    }
}
