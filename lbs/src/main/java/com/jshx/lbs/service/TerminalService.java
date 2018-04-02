package com.jshx.lbs.service;

import java.util.List;

public interface TerminalService {
    public List getTerminal(String softVersion,String startTime,String endTime,List keyIdList,int deviceId,String softVesion);
}
