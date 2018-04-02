package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface OperateLogMapper {
    public List getOperateType();
    public List searchOperateLog(Map map);
    public List searchOperateLogSum(Map map);
    public List searchLoginLog(Map map);
}
