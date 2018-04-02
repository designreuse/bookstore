package com.jshx.lbs.web.rest;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysDriverService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.codahale.metrics.annotation.Timed;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SysDriverResource {
    @Resource
    private SysDriverService sysDriverService;

    @PostMapping("/getDriverInfo")
    @Timed
    @ResponseBody
    public List getDriverInfo()
    {
        return sysDriverService.getDriverInfo();
    }


    @PostMapping("/queryDriver")
    @Timed
    @ResponseBody
    public List queryDriver(@RequestParam(value = "d_name", required = false) String d_name)
    {
        return sysDriverService.queryDriver(d_name);
    }



    @PostMapping("/saveDriver")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveDriver(
        @RequestParam(value = "d_dage", required = false) String d_dage,
        @RequestParam(value = "d_license", required = false) String d_license,
        @RequestParam(value = "d_name", required = false) String d_name,
        @RequestParam(value = "d_mobile", required = false) String d_mobile,
        @RequestParam(value = "d_icnumber", required = false) String d_icnumber,
        @RequestParam(value = "d_tel", required = false) String d_tel,
        @RequestParam(value = "d_licensedate", required = false) String d_licensedate,
        @RequestParam(value = "d_birthdate", required = false) String d_birthdate,
        @RequestParam(value = "d_group", required = false) String d_group,
        @RequestParam(value = "d_sex", required = false) String d_sex,
        @RequestParam(value = "d_pic", required = false) String d_pic,
        @RequestParam(value = "d_driver_pic", required = false) String d_driver_pic,
        @RequestParam(value = "d_license_pic", required = false) String d_license_pic)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(d_name)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入d_name为空");
            return baseReturnMessage;
        }
        return  sysDriverService.saveDriver(d_dage,d_license,d_name,d_mobile,d_icnumber,d_tel,d_licensedate,d_birthdate
            ,d_group,d_sex,d_pic,d_driver_pic,d_license_pic,baseReturnMessage);
    }

    @PostMapping("/delDriverInfo")
    @Timed
    @ResponseBody
    public  BaseReturnMessage  delDriverInfo(@RequestParam(value = "d_id", required = false) String d_id)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(d_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入d_id为空");
            return baseReturnMessage;
        }
        return sysDriverService.delDriverInfo(d_id,baseReturnMessage);
    }


    @PostMapping("/updDriverInfo")
    @Timed
    @ResponseBody
    public BaseReturnMessage updRoleInfo(@RequestParam(value = "d_id", required = false) String d_id,
                                         @RequestParam(value = "d_dage", required = false) String d_dage,
                                         @RequestParam(value = "d_license", required = false) String d_license,
                                         @RequestParam(value = "d_name", required = false) String d_name,
                                         @RequestParam(value = "d_mobile", required = false) String d_mobile,
                                         @RequestParam(value = "d_icnumber", required = false) String d_icnumber,
                                         @RequestParam(value = "d_tel", required = false) String d_tel,
                                         @RequestParam(value = "d_licensedate", required = false) String d_licensedate,
                                         @RequestParam(value = "d_birthdate", required = false) String d_birthdate,
                                         @RequestParam(value = "d_group", required = false) String d_group,
                                         @RequestParam(value = "d_sex", required = false) String d_sex,
                                         @RequestParam(value = "d_pic", required = false) String d_pic,
                                         @RequestParam(value = "d_driver_pic", required = false) String d_driver_pic,
                                         @RequestParam(value = "d_license_pic", required = false) String d_license_pic)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(d_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入d_id为空");
            return baseReturnMessage;
        }
        return  sysDriverService.updDriverInfo(d_id,d_dage,d_license,d_name,d_mobile,d_icnumber,d_tel,d_licensedate,d_birthdate
            ,d_group,d_sex,d_pic,d_driver_pic,d_license_pic,baseReturnMessage);
    }

}
