package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.ElectronicService;
import com.jshx.lbs.service.mapper.ElectronicMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;


@Transactional
@Service("ElectronicService")
public class ElectronicServiceImpl  implements ElectronicService {
    @Resource
    private ElectronicMapper electronicMapper;

    @Override
    public List<Map> getElectronicInfo() {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        return electronicMapper.getElectronicInfo(companyId);
    }

    @Override
    public BaseReturnMessage saveElectronic(String efname, String efStartTime, String efEndTime, String alarmType, String timeSpan, String speedlimit, String areatype, String ewidth, String eon,
                                 String isdisp, BaseReturnMessage baseReturnMessage) {
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("efname",efname);
        paramMap.put("efStartTime",efStartTime);
        paramMap.put("efEndTime",efEndTime);
        paramMap.put("alarmType",alarmType);

        paramMap.put("timeSpan",timeSpan);
        paramMap.put("speedlimit",speedlimit);
        paramMap.put("areatype",areatype);
        paramMap.put("ewidth",ewidth);
        paramMap.put("eon",eon);

        paramMap.put("isdisp",isdisp);
        electronicMapper.saveElectronic(paramMap);
        baseReturnMessage.setMessage("新增电子围栏成功");
        return baseReturnMessage;
    }



    @Override
    public BaseReturnMessage delElectronic(String efId, BaseReturnMessage baseReturnMessage) {
        electronicMapper.delElectronicInfo(efId);
        electronicMapper.delElectCar(efId);//删除车辆关联
        baseReturnMessage.setMessage("删除电子围栏成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updateElectronic(String efId, String efname, String efStartTime, String efEndTime, String alarmType, String timeSpan, String speedlimit, String areatype, String ewidth, String eon, String areaoutalarmToP, String areaoutalarmToD, String areainalarmToP, String areainalarmToD, String areasetSpeed, String AreaId, String arealonSet, String arealatSet, String areaStartTime, String areaEndTime, String speedOn, String overTime, String isdisp, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(efname)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("围栏名称为空");
        }
        Map<String,Object> paramMap = new HashMap<String,Object>();
        paramMap.put("efname",efname);
        paramMap.put("efStartTime",efStartTime);
        paramMap.put("efEndTime",efEndTime);
        paramMap.put("alarmType",alarmType);

        paramMap.put("timeSpan",timeSpan);
        paramMap.put("speedlimit",speedlimit);
        paramMap.put("areatype",areatype);
        paramMap.put("ewidth",ewidth);
        paramMap.put("eon",eon);

        paramMap.put("areaoutalarmToP",areaoutalarmToP);
        paramMap.put("areaoutalarmToD",areaoutalarmToD);
        paramMap.put("areainalarmToP",areainalarmToP);
        paramMap.put("areainalarmToD",areainalarmToD);
        paramMap.put("areasetSpeed",areasetSpeed);
        paramMap.put("AreaId",AreaId);
        paramMap.put("arealonSet",arealonSet);
        paramMap.put("arealatSet",arealatSet);
        paramMap.put("areaStartTime",areaStartTime);
        paramMap.put("areaEndTime",areaEndTime);
        paramMap.put("speedOn",speedOn);
        paramMap.put("overTime",overTime);

        paramMap.put("isdisp",isdisp);
        electronicMapper.updElectronicInfo(paramMap);
        baseReturnMessage.setMessage("电子围栏修改成功");
        return baseReturnMessage;
    }



    @Override
    public BaseReturnMessage setElectCar(String efId, List carIdList, BaseReturnMessage baseReturnMessage) {
        electronicMapper.delElectCar(efId);
        for(Object carId :carIdList)
        {
            Map<String,Object>paramMap = new HashMap<String,Object>();
            paramMap.put("carId",carId);
            paramMap.put("ef_id",efId.toString());
            electronicMapper.setElectCar(paramMap);
        }
        baseReturnMessage.setMessage("电子围栏车辆设置成功");
        return baseReturnMessage;
    }
}


