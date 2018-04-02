package com.jshx.lbs.service.impl;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.mapper.ShapeMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jshx.lbs.service.ShapeService;

import javax.annotation.Resource;
import java.util.*;

@Transactional
@Service("ShapeService")
public class ShapeServiceImpl implements ShapeService{

    @Resource
    private ShapeMapper shapeMapper;
    @Override
    public List<Map> getShapeInfo() {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        return shapeMapper.getShapeInfo(companyId);
    }

    @Override
    public List<Map> getSingleShape(String shape_id) {
        return shapeMapper.getSingleUser(shape_id);
    }

    @Override
    public List<Map> queryShapeInfo(String shape_name) {
        return shapeMapper.queryShapeInfo(shape_name);
    }


    @Override
    public BaseReturnMessage saveShape(String shape_name, String shape_memo, String shape_img, String shape_log, String shape_lat, String shape_scale, BaseReturnMessage baseReturnMessage) {
        if(StringUtils.isBlank(shape_name)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("标记名称为空");
        }
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        Date createdon = new Date();
        Map<String,Object>paramMap = new HashMap<String,Object>();
        String uuid = UUID.randomUUID().toString();
        paramMap.put("shape_id",uuid);
        paramMap.put("shape_name",shape_name);
        paramMap.put("shape_memo",shape_memo);
        paramMap.put("companyid",companyId);
        paramMap.put("createdon",createdon);
        paramMap.put("createdby",userId);
        paramMap.put("modifiedon",createdon);
        paramMap.put("modifiedby",userId);
        paramMap.put("shape_img",shape_img);
        paramMap.put("shape_log",shape_log);
        paramMap.put("shape_lat",shape_lat);
        paramMap.put("shape_scale",shape_scale);
        shapeMapper.saveShape(paramMap);
        baseReturnMessage.setMessage("添加标记成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage delShape(String shape_id, BaseReturnMessage baseReturnMessage) {
        shapeMapper.delShapeInfo(shape_id);
        baseReturnMessage.setMessage("删除标记成功");
        return baseReturnMessage;
    }

    @Override
    public BaseReturnMessage updateShape(String shape_id, String shape_name, String shape_memo, String shape_img, String shape_scale, BaseReturnMessage baseReturnMessage) {
        Date modifiedon = new Date();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String userId = mapDetail.get("userId").toString();
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("shape_id",shape_id);
        paramMap.put("shape_name",shape_name);
        paramMap.put("shape_memo",shape_memo);
        paramMap.put("shape_img",shape_img);
        paramMap.put("modifiedon",modifiedon);
        paramMap.put("modifiedby",userId);
        paramMap.put("shape_scale",shape_scale);
        shapeMapper.updShapeInfo(paramMap);
        baseReturnMessage.setMessage("修改标记成功");
        return baseReturnMessage;
    }
}
