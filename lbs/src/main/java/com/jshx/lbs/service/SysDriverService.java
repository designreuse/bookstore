package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface SysDriverService {
    public  List<Map> getDriverInfo();
    public  List<Map> queryDriver(String d_name);

    public BaseReturnMessage saveDriver(String d_dage,String d_license,String d_name,String d_mobile,String d_icnumber,
                                        String d_tel,String d_licensedate,String d_birthdate,String d_group,
                                        String d_sex, String d_pic,String d_driver_pic,String d_license_pic,
                                        BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delDriverInfo(String  d_id,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updDriverInfo(String  d_id,String d_dage,String d_license,String d_name,String d_mobile,String d_icnumber,
                                           String d_tel,String d_licensedate,String d_birthdate,String d_group,
                                           String d_sex, String d_pic,String d_driver_pic,String d_license_pic,
                                           BaseReturnMessage baseReturnMessage);
}
