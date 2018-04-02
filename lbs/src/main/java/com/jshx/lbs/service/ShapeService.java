package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface ShapeService {
    public List<Map> getShapeInfo();
    public List<Map> getSingleShape(String shape_id);
    public List<Map> queryShapeInfo(String shape_name);
    public BaseReturnMessage saveShape(String shape_name, String shape_memo, String shape_img, String shape_log,String shape_lat,
                                       String shape_scale, BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage delShape(String shape_id,BaseReturnMessage baseReturnMessage);
    public BaseReturnMessage updateShape(String shape_id,String shape_name, String shape_memo, String shape_img,
                                  String shape_scale, BaseReturnMessage baseReturnMessage);

}
