package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysRoleLbsService;
import io.github.jhipster.web.util.ResponseUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * REST controller for managing SysRole.
 */
@RestController
@RequestMapping("/api")
public class SysRoleLbsResource {

    @Resource
    private SysRoleLbsService sysRoleLbsService;

    private final Logger log = LoggerFactory.getLogger(SysRoleLbsResource.class);

    private static final String ENTITY_NAME = "sysRole";

    @PostMapping("/getroles")
    @Timed
    @ResponseBody
    public  List getRoleInfo()
    {
        return sysRoleLbsService.getRoleInfo();
    }

    @PostMapping("/getrolePris")
    @Timed
    @ResponseBody
    public   List queryRolePri(@RequestParam(value = "role_id", required = false) String role_id)
    {
        return sysRoleLbsService.queryRolePri(role_id);

    }

    @PostMapping("/getallPris")
    @Timed
    @ResponseBody
    public   List queryAllcompanyPri()
    {
        return sysRoleLbsService.queryAllCompanyPri();

    }

    @PostMapping("/setRolePri")
    @Timed
    @ResponseBody
    public BaseReturnMessage setRolePri(@RequestParam(value = "role_id", required = false) String role_id,
                                          @RequestParam(value = "priIdList", required = false) List priIdList)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(role_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入role_id为空");
            return baseReturnMessage;
        }
        return  sysRoleLbsService.setRolePri(role_id,priIdList,baseReturnMessage);
    }


    @PostMapping("/insertRole")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveRoleInfo(@RequestParam(value = "role_name", required = false) String role_name,
                                         @RequestParam(value = "role_desc", required = false) String role_desc)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        return  sysRoleLbsService.saveRole(role_name,role_desc,baseReturnMessage);
    }

    @PostMapping("/delRole")
    @Timed
    @ResponseBody
    public  BaseReturnMessage  delRoleInfo(@RequestParam(value = "role_id", required = false) String role_id)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(role_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入role_id为空");
            return baseReturnMessage;
        }
        return sysRoleLbsService.delRole(role_id,baseReturnMessage);
    }


    @PostMapping("/updateRole")
    @Timed
    @ResponseBody
    public BaseReturnMessage updRoleInfo(@RequestParam(value = "role_id", required = false) String role_id,
                                         @RequestParam(value = "role_name", required = false) String role_name,
                                         @RequestParam(value = "role_desc", required = false) String role_desc)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(role_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入role_id为空");
            return baseReturnMessage;
        }
        return  sysRoleLbsService.updateRole(role_id,role_name,role_desc,baseReturnMessage);
    }
}
