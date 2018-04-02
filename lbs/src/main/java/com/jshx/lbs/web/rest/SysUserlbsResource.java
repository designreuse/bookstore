package com.jshx.lbs.web.rest;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.SysUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.codahale.metrics.annotation.Timed;

import javax.annotation.Resource;
import java.util.List;


@RestController
@RequestMapping("/api")
public class SysUserlbsResource {
    @Resource
    private SysUserService sysUserService;
    @PostMapping("/setUserCars")
    @Timed
    @ResponseBody
    public BaseReturnMessage setUserCars(@RequestParam(value = "userid", required = false) String user_id,
                                         @RequestParam(value = "carIdList", required = false) List carIdList)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入user_id为空");
            return baseReturnMessage;
        }
        return  sysUserService.setUserCars(user_id,carIdList,baseReturnMessage);
    }

    @PostMapping("/setUserLevel")
    @Timed
    @ResponseBody
    public BaseReturnMessage setUserLevel(@RequestParam(value = "userid", required = false) String user_id,
                                          @RequestParam(value = "level", required = false) String level)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入userid为空");
            return baseReturnMessage;
        }
        return  sysUserService.setUserLevel(user_id,level,baseReturnMessage);
    }


    @PostMapping("/getUserCars")
    @Timed
    @ResponseBody
    public   List getUserCars()
    {
        return sysUserService.getUserCars();

    }


    @PostMapping("/getUserInfo")
    @Timed
    @ResponseBody
    public   List getUserInfo()
    {
        return sysUserService.getUserInfo();

    }


    @PostMapping("/queryUserInfo")
    @Timed
    @ResponseBody
    public   List queryUserInfo(@RequestParam(value = "username", required = false) String username)
    {
        return sysUserService.queryUserInfo(username);

    }


    @PostMapping("/getUserRoles")
    @Timed
    @ResponseBody
    public   List getUserRoles(@RequestParam(value = "userid", required = false) String user_id)
    {
        return sysUserService.getUserRoles(user_id);

    }

    @PostMapping("/setUserRole")
    @Timed
    @ResponseBody
    public BaseReturnMessage setUserRole(@RequestParam(value = "userid", required = false) String user_id,
                                         @RequestParam(value = "roleIdList", required = false) List roleIdList)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入user_id为空");
            return baseReturnMessage;
        }
        return  sysUserService.setUserRole(user_id,roleIdList,baseReturnMessage);
    }


    @PostMapping("/saveUser")
    @Timed
    @ResponseBody
    public BaseReturnMessage saveUser(@RequestParam(value = "username", required = false) String username,
                                      @RequestParam(value = "userpass", required = false) String userpass,
                                      @RequestParam(value = "userdesc", required = false) String userdesc,
                                      @RequestParam(value = "realname", required = false) String realname,
                                      @RequestParam(value = "groupid", required = false) String groupid,
                                      @RequestParam(value = "userphone", required = false) String userphone,
                                      @RequestParam(value = "email", required = false) String email,
                                      @RequestParam(value = "userlevel", required = false) String userlevel)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        return  sysUserService.saveUser(username,userpass,userdesc,realname,groupid,userphone,email,userlevel,baseReturnMessage);
    }


    @PostMapping("/delUserInfo")
    @Timed
    @ResponseBody
    public  BaseReturnMessage  delUserInfo(@RequestParam(value = "userid", required = false) String user_id)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入user_id为空");
            return baseReturnMessage;
        }
        return sysUserService.delUser(user_id,baseReturnMessage);
    }


    @PostMapping("/getSingleUser")
    @Timed
    @ResponseBody
    public   List getSingleUser(@RequestParam(value = "userid", required = false) String userid)
    {
        return sysUserService.getSingleUser(userid);

    }

    @PostMapping("/updateUser")
    @Timed
    @ResponseBody
    public BaseReturnMessage updateUser(@RequestParam(value = "userid", required = false) String user_id,
                                        @RequestParam(value = "username", required = false) String username,
                                        @RequestParam(value = "userdesc", required = false) String userdesc,
                                        @RequestParam(value = "realname", required = false) String realname,
                                        @RequestParam(value = "groupid", required = false) String groupid,
                                        @RequestParam(value = "userphone", required = false) String userphone,
                                        @RequestParam(value = "email", required = false) String email,
                                        @RequestParam(value = "userlevel", required = false) String userlevel)
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入user_id为空");
            return baseReturnMessage;
        }
        return  sysUserService.updateUser(user_id,username,userdesc,realname,groupid,userphone,email,userlevel,baseReturnMessage);
    }


    @PostMapping("/updateUserPass")
    @Timed
    @ResponseBody
    public BaseReturnMessage updateUserPass(@RequestParam(value = "userid", required = false) String user_id,
                                            @RequestParam(value = "userpass", required = false) String userpass
                                        )
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入userid为空");
            return baseReturnMessage;
        }
        return  sysUserService.updateUserPass(user_id,userpass,baseReturnMessage);
    }


    @PostMapping("/setUserLock")
    @Timed
    @ResponseBody
    public BaseReturnMessage setUserLock(@RequestParam(value = "userid", required = false) String user_id,
                                            @RequestParam(value = "userstatus", required = false) String userstatus
    )
    {
        BaseReturnMessage baseReturnMessage = new BaseReturnMessage();
        if(StringUtils.isBlank(user_id)){
            baseReturnMessage.setResult(Constants.FAULT);
            baseReturnMessage.setMessage("传入userid为空");
            return baseReturnMessage;
        }
        return  sysUserService.setUserLock(user_id,userstatus,baseReturnMessage);
    }
}
