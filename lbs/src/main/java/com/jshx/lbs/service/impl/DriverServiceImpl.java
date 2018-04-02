package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.DriverService;
import com.jshx.lbs.service.mapper.DriverMapper;
import com.jshx.lbs.web.rest.util.CodeUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;


import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("DriverService")
public class DriverServiceImpl implements DriverService {

    @Resource
    private DriverMapper driverMapper;


    @Override
    public List getDriverComparaInfo(String startTime, String endTime, String dealResult) {
        int dealResultInt = -1;
        if(StringUtils.isNotBlank(dealResult)&&Integer.parseInt(dealResult) != -1){
            dealResultInt = Integer.parseInt(dealResult);
        }
        Map<String,Object>paramMap = new HashMap<String, Object>();
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("dealResult",dealResultInt);
        List<Map> resultList = driverMapper.getDriverComparaInfo(paramMap);
        if(resultList!=null && resultList.size()>0){
            for(Map<String,Object> map : resultList){
                map.put("DEAL_RESULT_STR","");
                map.put("COMPARE_RESULT_STR","");
                if(map.get("DEAL_RESULT")!=null&&StringUtils.isNotBlank(map.get("DEAL_RESULT").toString())){
                    map.put("DEAL_RESULT_STR", Constants.PHOTO_DEAL_MAP.get(Integer.parseInt(map.get("DEAL_RESULT").toString())));
                }if(map.get("COMPARE_RESULT")!=null&&StringUtils.isNotBlank(map.get("COMPARE_RESULT").toString())){
                    map.put("COMPARE_RESULT_STR", Constants.PHOTO_COMPARA_MAP.get(Integer.parseInt(map.get("COMPARE_RESULT").toString())));
                }
                if(map.get("PHOTOSTEAM")==null &&StringUtils.isNotBlank(map.get("PHOTOSTEAM").toString())&&map.get("PHOTO_COMPARE_STEAM")!=null &&StringUtils.isNotBlank(map.get("PHOTO_COMPARE_STEAM").toString())){
                    map.put("PHOTOSTEAM","");
                    map.put("PHOTO_COMPARE_STEAM","");
                    return resultList;
                }
                Blob photoSteam = (Blob)map.get("PHOTOSTEAM");
                Blob photoCompareSteam = (Blob)map.get("PHOTO_COMPARE_STEAM");
                byte[] photoBytes = CodeUtil.blobToBytes(photoSteam);
                byte[] photoCompareBytes = CodeUtil.blobToBytes(photoCompareSteam);
                try {
                    map.put("PHOTOSTEAM","data:image/jpeg;base64,"+new String(Base64Utils.encode(photoBytes),"UTF-8").replaceAll("\r\n",""));
                    map.put("PHOTO_COMPARE_STEAM","data:image/jpeg;base64,"+new String(Base64Utils.encode(photoCompareBytes),"UTF-8").replaceAll("\r\n",""));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

            }
        }
        return resultList;
    }

    @Override
    public List getDriverComparaInfoById(String id) {
        List<Map> resultList = driverMapper.getDriverComparaInfoById(id);
        if(resultList!=null && resultList.size()>0){
            for(Map<String,Object> map : resultList){
                map.put("DEAL_RESULT_STR","");
                map.put("COMPARE_RESULT_STR","");
                if(map.get("DEAL_RESULT")!=null && StringUtils.isNotBlank(map.get("DEAL_RESULT").toString())){
                    map.put("DEAL_RESULT_STR", Constants.PHOTO_DEAL_MAP.get(Integer.parseInt(map.get("DEAL_RESULT").toString())));
                }if(map.get("COMPARE_RESULT")!=null && StringUtils.isNotBlank(map.get("COMPARE_RESULT").toString())){
                    map.put("COMPARE_RESULT_STR", Constants.PHOTO_COMPARA_MAP.get(Integer.parseInt(map.get("COMPARE_RESULT").toString())));
                }
                if(map.get("PHOTOSTEAM")==null &&StringUtils.isNotBlank(map.get("PHOTOSTEAM").toString())&&map.get("PHOTO_COMPARE_STEAM")!=null &&StringUtils.isNotBlank(map.get("PHOTO_COMPARE_STEAM").toString())){
                    map.put("PHOTOSTEAM","");
                    map.put("PHOTO_COMPARE_STEAM","");
                    return resultList;
                }
                Blob photoSteam = (Blob)map.get("PHOTOSTEAM");
                Blob photoCompareSteam = (Blob)map.get("PHOTO_COMPARE_STEAM");
                byte[] photoBytes = CodeUtil.blobToBytes(photoSteam);
                byte[] photoCompareBytes = CodeUtil.blobToBytes(photoCompareSteam);
                try {
                    map.put("PHOTOSTEAM","data:image/jpeg;base64,"+new String (Base64Utils.encode(photoBytes),"UTF-8").replaceAll("\r\n",""));
                    map.put("PHOTO_COMPARE_STEAM","data:image/jpeg;base64,"+new String (Base64Utils.encode(photoCompareBytes),"UTF-8").replaceAll("\r\n",""));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

            }
        }
        return resultList;
    }

    @Override
    public BaseReturnMessage dealDriverCompara(String id, String dealUser, int dealResult, String dealContent) {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
       Map<String,Object> paramMap= new HashMap<String,Object>();
        paramMap.put("id",id);
        paramMap.put("dealUser",dealUser);
        paramMap.put("dealResult",dealResult);
        paramMap.put("dealContent",dealContent);
        paramMap.put("dealTime",new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        try {
            driverMapper.dealDriverCompara(paramMap);
            baseReturnMessage.setResult(Constants.SUCCESS);
            baseReturnMessage.setMessage("操作成功");
        }catch (Exception e){
            e.printStackTrace();
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("系统异常,请稍后再试");
        }
        return baseReturnMessage;
    }
}
