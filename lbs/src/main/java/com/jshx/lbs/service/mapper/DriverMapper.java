package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface DriverMapper {
    public List getDriverComparaInfo(Map map);
    public List getDriverComparaInfoById(String id);
    public void dealDriverCompara(Map map);
}
