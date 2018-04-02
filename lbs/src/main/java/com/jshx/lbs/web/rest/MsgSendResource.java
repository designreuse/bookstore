package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.MsgSendService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MsgSendResource {
    @Resource
    private MsgSendService msgSendService;


    @PostMapping("/getDicSubmit")
    @Timed
    @ResponseBody
    public List getDicSubmit(
        @RequestParam(value = "termTypeList", required = false) List termTypeList)

    {
        return msgSendService.getDicSubmit(termTypeList);
    }


    @PostMapping("/saveDicSubmit")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveDicSubmit(
                                           @RequestParam(value = "commandId", required = false) int commandId,
                                           @RequestParam(value = "paras", required = false) List paras,
                                           @RequestParam(value = "caridList", required = false) List caridList,
                                           @RequestParam(value = "keyidList", required = false) List keyidList, HttpServletRequest request)

    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        // 判断车辆是否被锁
        List<Map>  lockCars = msgSendService.getLockCars(caridList);
        if(lockCars!=null && lockCars.size()!=0)
        {
            baseReturnMessage.setMessage("有车辆被锁，无法发送指令");
        }
        else
        {
            String ip = GetUSerInfoUtil.getIpAddr(request);
            String idx = msgSendService.saveDicSubmit(commandId,paras,caridList,keyidList,ip);
            baseReturnMessage.setMessage("指令发送成功, 稍后会有终端反馈信息"+ idx);
        }
        return baseReturnMessage;
    }
}

