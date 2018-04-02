package com.jshx.lbs.service;

import com.jshx.lbs.domain.BaseReturnMessage;

import java.util.List;
import java.util.Map;

public interface MsgSendService {
    public List<Map> getDicSubmit(List<String> termtypeList);
    public String saveDicSubmit(int cmdId, List paras, List carids, List keyids,String ip);
    public List getLockCars(List carids);

}
