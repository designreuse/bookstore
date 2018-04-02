package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.PlanService;
import com.jshx.lbs.service.mapper.MessageMapper;
import com.jshx.lbs.service.MessageService;
import com.jshx.lbs.service.mapper.PlanMapper;
import com.jshx.lbs.service.util.RandomUtil;
import com.jshx.lbs.web.rest.AlarmDataCountResource;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;

@Transactional
@Service("messageService")
public class MessageServiceImpl implements MessageService {

    private final org.slf4j.Logger log = LoggerFactory.getLogger(MessageServiceImpl.class);

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private PlanService planService;

    @Override
    public void saveMsg(int commandId, String commandPara, List keyIdList,String ip,BaseReturnMessage baseReturnMessage) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        Date createdon = new Date();
        String userId = mapDetail.get("userId").toString();
        List<Map> paramList = messageMapper.getMsggetParam(keyIdList);
        Queue<Long>queue = null;
        try {
            queue = RandomUtil.getCommandIdxList(messageMapper,paramList.size());
        } catch (Exception e) {
            log.error("无法获取到IDX随机数");
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("无法获取到IDX随机数");
            return ;
        }
        for (Map map : paramList) {
            String d_id = UUID.randomUUID().toString();
            String guid = UUID.randomUUID().toString();
            map.put("idx", d_id);
            map.put("guid", guid);
            map.put("commandId", commandId);
            map.put("COMPANYID", "lbs");
            map.put("commandIdX", queue.poll());
            map.put("commandPara", commandPara);
            map.put("userId2", userId);
            map.put("createdon", createdon);
            map.put("description", "立即升级");
            map.put("ip",ip);
            messageMapper.saveMsg(map);
            messageMapper.saveMsgSendHis(map);
            messageMapper.saveMsgSendDetail(map);
        }
    }

//    @Override
//    public int delMsg(List guidList) {
//        guidList = new ArrayList();
//        String guid = "d27bdd6b-54f0-47af-8723-171c9e323354";
//        guidList.add(guid);
//        return messageMapper.delMsg(guidList);
//    }

    @Override
    public void saveMsgInterval(String planId, List keyIdList,String ip) {
        List<Map> list = planService.searchPlan(planId, null, null, null);
        Map planResult = list.get(0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        Date createdon = new Date();
        String userId = mapDetail.get("userId").toString();
        keyIdList = new ArrayList();
        List<Map> paramList = messageMapper.getMsggetParam(keyIdList);
        for (Map map : paramList) {
            map.put("commandIdX", sdf.format(createdon));
            map.put("userId2", userId);
            map.put("createdon", createdon);
            map.put("description", "定时升级");
            map.put("commandId", planResult.get("commandId"));
            map.put("commandPara", planResult.get("commandPara"));
            map.put("sendTime", planResult.get("planTime"));
            map.put("ip", ip);
            messageMapper.saveMsgTnterval(map);
        }
    }

    @Override
    public void saveMsgInterval(Map paramMap,List keyIdList,String ip) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        Date createdon = new Date();
        String userId = mapDetail.get("userId").toString();
        List<Map> paramList = messageMapper.getMsggetParam(keyIdList);
        for (Map map : paramList) {
            map.put("commandIdX", sdf.format(createdon));
            map.put("userId2", userId);
            map.put("createdon", createdon);
            map.put("description", "定时升级");
            map.put("commandId", paramMap.get("commandId"));
            map.put("commandPara", paramMap.get("commandPara"));
            map.put("sendTime", paramMap.get("planTime"));
            map.put("pid", paramMap.get("id"));
            map.put("ip", ip);
            messageMapper.saveMsgTnterval(map);
        }
    }

    @Override
    public int delMsg(String pid) {
        return messageMapper.delMsg(pid);
    }

    @Override
    public List getMsgLog(String createUser, String startTime, String endTime, String commandId, String dealResult,String carNo,String softVesion,int deviceId,String productType) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("companyId", companyId);
        paramMap.put("createUser", createUser);
        paramMap.put("startTime", startTime);
        paramMap.put("endTime", endTime);
        paramMap.put("commandId", commandId);
        paramMap.put("dealResult", dealResult);
        paramMap.put("carNo", carNo);
        paramMap.put("softVesion", softVesion);
        paramMap.put("deviceId", deviceId);
        paramMap.put("productType", productType);
        List<Map> resultList = messageMapper.getMsgLog(paramMap);
        if(resultList!=null && resultList.size()>0){
            for(Map<String,Object>map : resultList){
                map.put("COMMAND_ID_STR","");
                if(map.get("COMMAND_ID")!=null&& StringUtils.isNotBlank(map.get("COMMAND_ID").toString())) {
                    map.put("COMMAND_ID_STR", Constants.MSG_UPDATE_MAP.get(Integer.parseInt(map.get("COMMAND_ID").toString())));
                }
                map.put("DEVICE_ID_STR","");
                if(map.get("DEVICE_ID")!=null&&StringUtils.isNotBlank(Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()))){
                    map.put("DEVICE_ID_STR",Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()));
                }
                if(map.get("UPDATE_RESULT")==null||map.get("UPDATE_RESULT").toString()==""){
                    map.put("UPDATE_RESULT","");
                }else if(Integer.parseInt(map.get("UPDATE_RESULT").toString()) == Constants.MSG_SUCCESS){
                    map.put("UPDATE_RESULT","升级成功");
                }else{
                    map.put("UPDATE_RESULT","升级失败");
                }
                if(map.get("USER_NAME")== null){
                    map.put("USER_NAME","");
                }
            }
        }
        return resultList;
    }

    @Override
    public String getCommandIdxStr() {
        return messageMapper.getCommandIdxStr();
    }

}
