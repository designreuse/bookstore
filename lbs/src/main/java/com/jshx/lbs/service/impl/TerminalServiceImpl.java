package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.service.TerminalService;
import com.jshx.lbs.service.mapper.TerminalMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("terminalService")
public class TerminalServiceImpl implements TerminalService{

    @Resource
    private TerminalMapper terminalMapper;

    @Override
    public List getTerminal(String softVersion,String startTime,String endTime,List keyIdList,int deviceId,String softVesion) {
        Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("softVersion",softVersion);
        paramMap.put("startTime",startTime);
        paramMap.put("endTime",endTime);
        paramMap.put("companyId",companyId);
        paramMap.put("keyIdList",keyIdList);
        paramMap.put("deviceId",deviceId);
        paramMap.put("softVesion",softVesion);
        List<Map<String,Object>>list = terminalMapper.getTerminal(paramMap);
        if(list!=null && list.size()>0) {
            for (Map<String, Object> map : list) {
                if(map.get("SOFT_VESION")==null){
                    map.put("SOFT_VESION","");
                }
                if(map.get("PRODUCT_TYPE")==null){
                    map.put("PRODUCT_TYPE","");
                }
                map.put("DEVICE_ID_STR", "");
                if( map.get("DEVICE_ID")!=null && !"".equals(map.get("DEVICE_ID")+"")) {
                    if (StringUtils.isNotBlank(Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()))) {
                        map.put("DEVICE_ID_STR", Constants.DEVICE_TYPE_MAP.get(map.get("DEVICE_ID").toString()));
                    }
                }
                if(map.get("UPDATE_RESULT")==null||map.get("UPDATE_RESULT").toString()==""){
                    map.put("UPDATE_RESULT","");
                }else if(Integer.parseInt(map.get("UPDATE_RESULT").toString()) == Constants.MSG_SUCCESS){
                    map.put("UPDATE_RESULT","升级成功");
                }else{
                    map.put("UPDATE_RESULT","升级失败");
                }
            }
        }
        return list;
    }
}
