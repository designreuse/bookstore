package com.jshx.lbs.web.rest;
import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.jshx.lbs.service.OperateLogService;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OperateLogResource {


    @Resource
    private OperateLogService  operateLogService;

    @PostMapping("/getOperateType")
    @Timed
    @ResponseBody
    public List getOperateType()
    {
        return  operateLogService.getOperateType();
    }


    @PostMapping("/searchOperateLog")
    @Timed
    @ResponseBody
    public List searchOperateLog(@RequestParam(value = "userName", required = false) String userName,
                                   @RequestParam(value = "opetype", required = false) String opetype,
                                   @RequestParam(value = "startTime", required = false) String startTime,
                                   @RequestParam(value = "endTime", required = false) String endTime)
    {
        return  operateLogService.searchOperateLog(userName,opetype,startTime,endTime);
    }

    @PostMapping("/searchOperateLogSum")
    @Timed
    @ResponseBody
    public List searchOperateLogSum(@RequestParam(value = "userName", required = false) String userName,
                                   @RequestParam(value = "opetype", required = false) String opetype,
                                   @RequestParam(value = "startTime", required = false) String startTime,
                                   @RequestParam(value = "endTime", required = false) String endTime)
    {
        return  operateLogService.searchOperateLogSum(userName,opetype,startTime,endTime);
    }


    @PostMapping("/searchLoginLog")
    @Timed
    @ResponseBody
    public List searchLoginLog(@RequestParam(value = "userName", required = false) String userName,
                                   @RequestParam(value = "opetype", required = false) String opetype,
                                   @RequestParam(value = "startTime", required = false) String startTime,
                                   @RequestParam(value = "endTime", required = false) String endTime)
    {
        return  operateLogService.searchLoginLog(userName,opetype,startTime,endTime);
    }
}

