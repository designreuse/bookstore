package com.jshx.lbs.service.mapper;

import java.util.List;
import java.util.Map;

public interface ElectronicMapper {

    List<Map> getElectronicInfo(String companyid);
    int saveElectronic(Map map);
    int delElectronicInfo(String  ef_id);
    int updElectronicInfo(Map map);
    int setElectCar(Map map);
    int delElectCar(String  ef_id);
    List<Map> getElectCar(String ef_id);
}
