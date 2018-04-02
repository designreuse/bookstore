package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface SysPrivilegeMapper {
    List<Map> getPrivilegeInfo();
    int savePrivilege(Map map);
    int delPrivilegeInfo(String  privilege_id);
    int updPrivilegeInfo(Map map);
}
