package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface MsgSendMapper {
    List<Map> getDicSubmit(Map map);
    List<Map> getLockCar(Map map);
    List<Map> getSendCar(Map map);
    List<Map> getSingleDic(int dictvalue);
    List<Map> getCarTerm(Map map);
    int saveMsgSendDetail(Map map);
    int saveTMsgSendHis(Map map);
    int saveTMsgSubmit(Map map);
}
