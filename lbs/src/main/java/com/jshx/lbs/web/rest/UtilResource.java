package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.web.rest.util.AddressUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UtilResource {

    @PostMapping("/getAddress")
    @Timed
    @ResponseBody
    public String getAddress(@RequestParam(value = "longitude", required = true) String longitude,
                           @RequestParam(value = "latitude", required = true) String latitude){
        return AddressUtil.getAddress(longitude,latitude);
    }
}
