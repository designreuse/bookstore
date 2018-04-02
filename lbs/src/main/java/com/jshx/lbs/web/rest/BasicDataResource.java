package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.repository.BasicDataRepository;
import com.jshx.lbs.security.SecurityUtils;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class BasicDataResource
{
    private final Logger log = LoggerFactory.getLogger(BasicDataResource.class);

    private final BasicDataRepository basicDataRepository;

    public BasicDataResource(BasicDataRepository basicDataRepository)
    {
        this.basicDataRepository = basicDataRepository;
    }

    @PostMapping("/getCarBasicData")
    @Timed
    @ResponseBody
    public List findCarHisBaseData(@RequestParam(value = "carNo", required = false) String carNo)
    {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userName = SecurityUtils.getCurrentUserLogin();
        List<HashMap<String, Object>> carHisList =  new ArrayList<HashMap<String,Object>>();
        //第一步  carNo全查
        List<String> userAllList = basicDataRepository.queryCarNoAll(userName,companyId);

        //1.carNo为空全查
        if(carNo == null || StringUtils.isBlank(carNo.trim()))
        {
            List<Object[]> ListMap1 =  basicDataRepository.findCarHisBaseData(userAllList);
            if(ListMap1 != null && ListMap1.size()!=0) {
                for (Object[] object : ListMap1) {
                    HashMap<String, Object> map = new HashMap<String, Object>();
                    map.put("CAR_NO", object[0] + "");
                    map.put("KEY_ID", object[2] + "");
                    map.put("PLATECOLOR", object[3] + "");
                    map.put("LAST_TIME", object[4] + "");
                    map.put("GROUPNAME", object[6] + "");

                    carHisList.add(map);
                }
            }
        }else//2.不为空，模糊查询
        {
            HashMap<String, Object> resultMap= new HashMap<String, Object>();
            int count = 0;

            for(String singleString : userAllList)
            {
                if(singleString.contains(carNo))
                {
                    count++;
                }
            }
            if(count == 0)
            {
                resultMap.put("message","没有权限的车辆");
                carHisList.add(resultMap);

                return carHisList;
            }

            List<Object[]> ListMap2 = basicDataRepository.queryCarBaseDataLikely(carNo,userName,companyId);
            if(ListMap2 != null && ListMap2.size()!=0) {
                for (Object[] object : ListMap2) {
                    HashMap<String, Object> map = new HashMap<String, Object>();

                    if(userAllList.contains(object[0]+""))
                    {
                        map.put("CAR_NO", object[0] + "");
                        map.put("KEY_ID", object[1] + "");
                        map.put("PLATECOLOR", object[2] + "");
                        map.put("LAST_TIME", object[3] + "");
                        map.put("GROUPNAME", object[4] + "");

                        carHisList.add(map);
                    }
                }
            }

        }

        return carHisList;
    }
}
