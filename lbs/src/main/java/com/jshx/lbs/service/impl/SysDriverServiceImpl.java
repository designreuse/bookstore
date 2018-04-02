package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysDriverService;
import com.jshx.lbs.service.mapper.SysDriverMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Transactional
@Service("SysDriverService")
public class SysDriverServiceImpl implements SysDriverService {

    @Autowired
    private SysDriverMapper sysDriverMapper;

    @Override
    public List<Map> getDriverInfo() {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        return sysDriverMapper.getDriverInfo(companyId);
    }

    @Override
    public List<Map> queryDriver(String d_name) {
        return sysDriverMapper.queryDriver(d_name);
    }

    @Override
    public BaseReturnMessage saveDriver(String d_dage, String d_license, String d_name, String d_mobile,String d_icnumber, String d_tel,
                                        String d_licensedate, String d_birthdate, String d_group, String d_sex, String d_pic,
                                        String d_driver_pic, String d_license_pic, BaseReturnMessage baseReturnMessage) {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> driverRepeat = sysDriverMapper.queryRepeatDriverInfo(companyId,d_name);
        if(driverRepeat!=null && driverRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该驾驶员名称已存在");
        }

        //IC卡号重复判断
        List<Map> icRepeat = sysDriverMapper.queryRepeatDriverIC(d_icnumber);
        if(icRepeat!=null && icRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该IC号已存在");
        }
        Map<String,Object>paramMap = new HashMap<String,Object>();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("d_id",uuid);
        paramMap.put("companyId",companyId);
        paramMap.put("d_dage",d_dage);
        paramMap.put("d_license",d_license);
        paramMap.put("d_name",d_name);

        paramMap.put("d_mobile",d_mobile);
        paramMap.put("d_tel",d_tel);
        paramMap.put("d_licensedate",d_licensedate);
        paramMap.put("d_birthdate",d_birthdate);
        paramMap.put("d_group",d_group);
        paramMap.put("d_sex",d_sex);
        paramMap.put("d_pic",d_pic);
        paramMap.put("d_driver_pic",d_driver_pic);
        paramMap.put("d_license_pic",d_license_pic);

        sysDriverMapper.saveDriver(paramMap);
        baseReturnMessage.setMessage("新增驾驶员成功");
        return baseReturnMessage;
    }


    @Override
    public BaseReturnMessage delDriverInfo(String d_id, BaseReturnMessage baseReturnMessage) {
        sysDriverMapper.delDriverInfo(d_id);
        //判断车辆是否关联司机，清空车辆司机
        sysDriverMapper.updDriverCar(d_id);
        baseReturnMessage.setMessage("删除驾驶员成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updDriverInfo(String d_id,String d_dage, String d_license, String d_name, String d_mobile,String d_icnumber, String d_tel,
                                           String d_licensedate, String d_birthdate, String d_group, String d_sex, String d_pic,
                                           String d_driver_pic, String d_license_pic, BaseReturnMessage baseReturnMessage) {
        //驾驶员重复名称判断
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<Map> driverRepeat = sysDriverMapper.queryRepeatUpdDriverInfo(companyId,d_id,d_name);
        if(driverRepeat!=null && driverRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该驾驶员名称已存在");
        }
        //IC卡号重复判断
        List<Map> icRepeat = sysDriverMapper.queryRepeatUpdDriverIC(d_id,d_icnumber);
        if(icRepeat!=null && icRepeat.size()>0){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("该IC号已存在");
        }

        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("d_id",d_id);

        paramMap.put("d_dage",d_dage);
        paramMap.put("d_license",d_license);
        paramMap.put("d_name",d_name);

        paramMap.put("d_mobile",d_mobile);
        paramMap.put("d_tel",d_tel);
        paramMap.put("d_licensedate",d_licensedate);
        paramMap.put("d_birthdate",d_birthdate);
        paramMap.put("d_group",d_group);
        paramMap.put("d_sex",d_sex);
        paramMap.put("d_pic",d_pic);
        paramMap.put("d_driver_pic",d_driver_pic);
        paramMap.put("d_license_pic",d_license_pic);

        sysDriverMapper.updDriverInfo(paramMap);
        baseReturnMessage.setMessage("修改驾驶员成功");
        return baseReturnMessage;
    }

}
