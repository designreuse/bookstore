package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface MessageMapper {
    public void saveMsg(Map map);

    public void saveMsgTnterval(Map map);

    public void saveMsgSendHis(Map map);

    public void saveMsgSendDetail(Map map);

    public List getMsggetParam(List KeyIdList);

//    public  int delMsg(List guidList);

    public  int delMsg(String  pid);

    public  int updateMsg(String guid);

    public List getMsgLog(Map map);

    public String getCommandIdxStr();
}

