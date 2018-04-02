package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface PlanMapper {
    public void savePlan(Map map);
    public List searchPlan(Map map);
    public int delPlan(String id);
    public int updatePlan(Map map);
    public List getPlanInfoList(String pid);
}
