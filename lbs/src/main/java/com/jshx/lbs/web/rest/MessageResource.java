package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.MessageService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;


/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class MessageResource {

    private final Logger log = LoggerFactory.getLogger(MessageResource.class);


    @Resource
    private MessageService messageService;

    @PostMapping("/saveMsg")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveMsg(
        @RequestParam(value = "commandId", required = false) int commandId,
        @RequestParam(value = "commandPara", required = false) String commandPara,
        @RequestParam(value = "keyIdList", required = false) List keyIdList, HttpServletRequest request){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if (keyIdList == null || keyIdList.size() == 0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("数组为空");
            return baseReturnMessage;
        }
        try {
            baseReturnMessage.setResult(Constants.SUCCESS);
            baseReturnMessage.setMessage("操作成功");
            String ip = GetUSerInfoUtil.getIpAddr(request);
            messageService.saveMsg(commandId, commandPara, keyIdList,ip,baseReturnMessage);
            return baseReturnMessage;
        }catch (Exception e){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("出现异常,请稍后再试");
            return baseReturnMessage;
        }
    }

    @PostMapping("/saveMsgInterval")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveMsgInterval(
        @RequestParam(value = "keyIdList", required = false) List keyIdList,
        @RequestParam(value = "planId", required = false) String planId,
        HttpServletRequest request){
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if (keyIdList == null || keyIdList.size() == 0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("数组为空");
        }
        try {
            String ip = GetUSerInfoUtil.getIpAddr(request);
            messageService.saveMsgInterval(planId, keyIdList,ip);
            baseReturnMessage.setResult(Constants.SUCCESS);
            baseReturnMessage.setMessage("操作成功");
        }catch (Exception e){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("出现异常,请稍后再试");
        }finally {
            return baseReturnMessage;
        }

    }

//    @PostMapping("/delMsg")
//    @Timed
//    @ResponseBody
//    public BaseReturnMessage delMsg(@RequestParam(value = "guidList", required = false) List guidList){
//        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
//        if (guidList == null || guidList.size() == 0){
//            baseReturnMessage.setResult(Constants.FAULT);
//            baseReturnMessage.setMessage("数组为空");
//        }
//        int updateNum = messageService.delMsg(guidList);
//        if(updateNum>0){
//            baseReturnMessage.setResult(Constants.FAULT);
//            baseReturnMessage.setMessage("未执行删除操作，请核实");
//        }else{
//            baseReturnMessage.setResult(Constants.SUCCESS);
//            baseReturnMessage.setMessage("操作成功");
//        }
//        return baseReturnMessage;
//    }

    @PostMapping("/getMsgLog")
    @Timed
    @ResponseBody
    public List getMsgLog(
        @RequestParam(value = "createUser", required = false) String createUser,
        @RequestParam(value = "startTime", required = false) String startTime,
        @RequestParam(value = "endTime", required = false) String endTime,
        @RequestParam(value = "commandId", required = false) String commandId,
        @RequestParam(value = "dealResult", required = false) String dealResult,
        @RequestParam(value = "carNo", required = false) String carNo,
        @RequestParam(value = "softVesion", required = false) String softVesion,
        @RequestParam(value = "deviceId", required = false) String deviceId,
        @RequestParam(value = "productType", required = false) String productType){
        int deviceIdInt = -1;
        if(StringUtils.isNumeric(deviceId)){
            deviceIdInt = Integer.parseInt(deviceId);
        }
        return messageService.getMsgLog(createUser,startTime,endTime,commandId,dealResult,carNo,softVesion,deviceIdInt,productType);
    }

}
