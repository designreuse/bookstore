package com.jshx.lbs.web.rest;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.ShapeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.codahale.metrics.annotation.Timed;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ShapeResource {
    @Resource
    private ShapeService shapeService;

    @PostMapping("/getShapeInfo")
    @Timed
    @ResponseBody
    public List getShapeInfo()
    {
        return shapeService.getShapeInfo();
    }


    @PostMapping("/getSingleShape")
    @Timed
    @ResponseBody
    public List getShapeInfo(@RequestParam(value = "shape_id", required = false) String shape_id)
    {
        return shapeService.getSingleShape(shape_id);
    }


    @PostMapping("/queryShapeInfo")
    @Timed
    @ResponseBody
    public List queryShapeInfo(@RequestParam(value = "shape_name", required = false) String shape_name)
    {
        return shapeService.queryShapeInfo(shape_name);
    }


    @PostMapping("/saveShape")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveShape(@RequestParam(value = "shape_name", required = false) String shape_name,
                                      @RequestParam(value = "shape_memo", required = false) String shape_memo,
                                      @RequestParam(value = "shape_img", required = false) String shape_img,
                                      @RequestParam(value = "shape_log", required = false) String shape_log,
                                      @RequestParam(value = "shape_lat", required = false) String shape_lat,
                                      @RequestParam(value = "shape_scale", required = false) String shape_scale)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        return  shapeService.saveShape(shape_name,shape_memo,shape_img,shape_log,shape_lat,shape_scale,baseReturnMessage);
    }


    @PostMapping("/delShape")
    @Timed
    @ResponseBody
    public   BaseReturnMessage delShape(@RequestParam(value = "shape_id", required = false) String shape_id)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(shape_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入shape_id为空");
            return baseReturnMessage;
        }
        return shapeService.delShape(shape_id,baseReturnMessage);

    }


    @PostMapping("/updateShape")
    @Timed
    @ResponseBody
    public BaseReturnMessage updateShape(@RequestParam(value = "shape_id", required = false) String shape_id,
                                         @RequestParam(value = "shape_name", required = false) String shape_name,
                                         @RequestParam(value = "shape_memo", required = false) String shape_memo,
                                         @RequestParam(value = "shape_img", required = false) String shape_img,
                                         @RequestParam(value = "shape_scale", required = false) String shape_scale)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        return  shapeService.updateShape(shape_id,shape_name,shape_memo,shape_img,shape_scale,baseReturnMessage);
    }
}
