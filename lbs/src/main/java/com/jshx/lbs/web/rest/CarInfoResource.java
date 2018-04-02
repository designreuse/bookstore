package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.SysRole;
import com.jshx.lbs.domain.SysUser;
import com.jshx.lbs.domain.User;
import com.jshx.lbs.repository.CarInfoRepository;
import com.jshx.lbs.repository.SysUserRepository;
import com.jshx.lbs.repository.UserRepository;
import com.jshx.lbs.security.SecurityUtils;
import com.jshx.lbs.service.MailService;
import com.jshx.lbs.service.UserService;
import com.jshx.lbs.service.dto.UserDTO;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import com.jshx.lbs.web.rest.util.HeaderUtil;
import com.jshx.lbs.web.rest.vm.KeyAndPasswordVM;
import com.jshx.lbs.web.rest.vm.ManagedUserVM;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;


/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class CarInfoResource {

    private final Logger log = LoggerFactory.getLogger(CarInfoResource.class);

    @Resource
    private  CarInfoRepository carInfoRepository;

    @PostMapping("/getCarInfo")
    @Timed
    @ResponseBody
    public List getCarInfo(@RequestParam(value = "carNo", required = false) String carNo,
                             @RequestParam(value = "groupName", required = false) String groupName){
        List<HashMap<String, Object>> carInfoList =  new ArrayList<HashMap<String,Object>>();
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String userId = mapDetail.get("userId").toString();
        List<Object[]> list= carInfoRepository.findCarInfo(carNo,groupName,userId);
        if(list != null && list.size()!=0) {
            for (Object[] object : list) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                {
                    map.put("CAR_ID", object[0] + "");
                    map.put("CAR_NO", object[1] + "");
                    map.put("KEY_ID", object[2] + "");
                    map.put("GROUPNAME", object[3] + "");
                    map.put("PLATECOLOR", object[4] + "");

                    carInfoList.add(map);
                }
            }
        }
        return carInfoList;
    }

}
