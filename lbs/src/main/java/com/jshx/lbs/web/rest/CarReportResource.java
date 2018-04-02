package com.jshx.lbs.web.rest;

import com.jshx.lbs.service.CarReportService;
import org.springframework.web.bind.annotation.*;
import com.codahale.metrics.annotation.Timed;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CarReportResource
{
    @Resource
    private CarReportService carReportService;

    @PostMapping("/getCarReportDay")
    @Timed
    @ResponseBody
    public List getCarReportDay(@RequestParam(value = "keyId", required = false) String keyId,
                                @RequestParam(value = "startTime", required = false) String startTime,
                                @RequestParam(value = "endTime", required = false) String endTime
    )
    {
        return  carReportService.getCarReportDay(keyId,startTime,endTime);
    }


    @PostMapping("/getCarHisData")
    @Timed
    @ResponseBody
    public List getCarHisData(@RequestParam(value = "keyId", required = false) String keyId,
                                    @RequestParam(value = "startTime", required = false) String startTime,
                                    @RequestParam(value = "endTime", required = false) String endTime
    )
    {
        return  carReportService.getCarHisData(keyId,startTime,endTime);
    }

    @PostMapping("/getCarHisStopData")
    @Timed
    @ResponseBody
    public List getCarHisStopData(@RequestParam(value = "keyId", required = false) String keyId,
                                    @RequestParam(value = "startTime", required = false) String startTime,
                                    @RequestParam(value = "endTime", required = false) String endTime
    )
    {
        return  carReportService.getCarHisStopData(keyId,startTime,endTime);
    }

    @PostMapping("/QueryCarTraceByTime")
    @Timed
    @ResponseBody
    public List QueryCarTraceByTime(@RequestParam(value = "keyId", required = false) String keyId,
                                  @RequestParam(value = "startTime", required = false) String startTime,
                                  @RequestParam(value = "endTime", required = false) String endTime
    )
    {
        return  carReportService.QueryCarTraceByTime(keyId,startTime,endTime);
    }

    @PostMapping("/getCarDriverStatus")
    @Timed
    @ResponseBody
    public List getCarDriverStatus(@RequestParam(value = "keyId", required = false) String keyId
    )
    {
        return  carReportService.getCarDriverStatus(keyId);
    }

}
