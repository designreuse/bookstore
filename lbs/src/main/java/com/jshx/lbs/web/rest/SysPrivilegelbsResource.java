package com.jshx.lbs.web.rest;
import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysPrivilegelbsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.codahale.metrics.annotation.Timed;

import javax.annotation.Resource;
import java.util.List;
@RestController
@RequestMapping("/api")
public class SysPrivilegelbsResource {
    @Resource
    private SysPrivilegelbsService sysPrivilegelbsService;


    @PostMapping("/getPrivileges")
    @Timed
    @ResponseBody
    public List getPrivilegeInfo()
    {
        return sysPrivilegelbsService.getPrivilegeInfo();
    }

    @PostMapping("/insertPrivilege")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveRoleInfo(@RequestParam(value = "privilege_name", required = false) String privilege_name,
                                          @RequestParam(value = "privilege_desc", required = false) String privilege_desc,
                                          @RequestParam(value = "privilege_pid", required = false) String privilege_pid)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        return  sysPrivilegelbsService.savePrivilege(privilege_name,privilege_desc,privilege_pid,baseReturnMessage);
    }

    @PostMapping("/delPrivilege")
    @Timed
    @ResponseBody
    public  BaseReturnMessage  delPrivilege(@RequestParam(value = "privilege_id", required = false) String privilege_id)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(privilege_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入privilege_id为空");
            return baseReturnMessage;
        }
        return sysPrivilegelbsService.delPrivilege(privilege_id,baseReturnMessage);
    }


    @PostMapping("/updatePrivilege")
    @Timed
    @ResponseBody
    public BaseReturnMessage updRoleInfo(@RequestParam(value = "privilege_id", required = false) String privilege_id,
                                         @RequestParam(value = "privilege_name", required = false) String privilege_name,
                                         @RequestParam(value = "privilege_desc", required = false) String privilege_desc)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(privilege_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入privilege_id为空");
            return baseReturnMessage;
        }
        return  sysPrivilegelbsService.updatePrivilege(privilege_id,privilege_name,privilege_desc,baseReturnMessage);
    }
}
