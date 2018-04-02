package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface ShapeMapper {
    List<Map> getShapeInfo(String companyid);
    int saveShape(Map map);
    int delShapeInfo(String  shape_id);
    int updShapeInfo(Map map);
    List<Map> queryShapeInfo (String  shape_name);
    List<Map> getSingleUser(String  shape_id);
}
