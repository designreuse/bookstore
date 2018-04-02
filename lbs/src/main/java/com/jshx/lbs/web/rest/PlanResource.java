package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.PlanService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api")
public class PlanResource {

    @Resource
    private PlanService planService;

    @PostMapping("/savePlan")
    @Timed
    @ResponseBody
    public BaseReturnMessage savePlan(@RequestParam(value = "commandId", required = false) int commandId,
                                      @RequestParam(value = "commandPara", required = false) String commandPara,
                                      @RequestParam(value = "keyIdList", required = false) List keyIdList,
                                      @RequestParam(value = "planName", required = false) String planName,
                                      @RequestParam(value = "planTime", required = false) String planTime,
                                      HttpServletRequest request)
    {
//        keyIdList = new ArrayList();
//        keyIdList.add("13390730081");
//        keyIdList.add("18961964501");
//        planName = "11";
//        planTime = "2018-03-22 11:22:33";
//        commandPara = "123";
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        String ip = GetUSerInfoUtil.getIpAddr(request);
        baseReturnMessage = planService.savePlan(commandId,commandPara,planName,planTime,keyIdList,ip,baseReturnMessage);
        return baseReturnMessage;
    }

    @PostMapping("/delPlan")
    @Timed
    @ResponseBody
    public BaseReturnMessage delPlan(@RequestParam(value = "idList", required = false) List idList)
    {
//        idList = new ArrayList();
//        idList.add("0cfeaada-0825-465c-810c-0906ff3cb691");
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(idList == null || idList.size() == 0){
            baseReturnMessage.setMessage("请选中需要修改的记录");
            baseReturnMessage.setResult(Constants.FAULT);
        }
        planService.delPlan(idList);
        return baseReturnMessage;
    }

    @PostMapping("/searchPlan")
    @Timed
    @ResponseBody
    public List searchPlan(@RequestParam(value = "planName", required = false) String planName,
                                        @RequestParam(value = "startTime", required = false) String startTime,
                                            @RequestParam(value = "endTime", required = false) String endTime)
    {
        return planService.searchPlan(null,planName,startTime,endTime);
    }

    @PostMapping("/updatePlan")
    @Timed
    @ResponseBody
    public BaseReturnMessage updatePlan(@RequestParam(value = "id", required = false) String id,
                           @RequestParam(value = "commandId", required = false) int commandId,
                           @RequestParam(value = "commandPara", required = false) String commandPara,
                           @RequestParam(value = "planName", required = false) String planName,
                           @RequestParam(value = "planTime", required = false) String planTime,
                           @RequestParam(value = "keyIdList", required = false) List keyIdList,HttpServletRequest request) {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
//        id = "bf11d818-1bf0-478e-b9ad-eda4a8709a18";
        if(StringUtils.isBlank(id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入id为空");
            return baseReturnMessage;
        }
//        keyIdList = new ArrayList();
//        keyIdList.add("13390730081");
//        keyIdList.add("18961964501");
//        planTime = "2018-03-22 11:22:33";
        String ip = GetUSerInfoUtil.getIpAddr(request);
        return planService.updatePlan(id,commandId,commandPara,planName,planTime,keyIdList,ip,baseReturnMessage);
    }

    @PostMapping("/getPlanInfoList")
    @Timed
    @ResponseBody
    public List getPlanInfoList(@RequestParam(value = "id", required = false) String id
    ){
        return planService.getPlanInfoList(id);
    }
}
