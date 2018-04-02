package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;

public interface DriverService {
    public List getDriverComparaInfo( String startTime, String endTime, String keyIdList);
    public List getDriverComparaInfoById( String id);
    public BaseReturnMessage dealDriverCompara(String id,String dealUser,int dealResult,String dealContent);
}
