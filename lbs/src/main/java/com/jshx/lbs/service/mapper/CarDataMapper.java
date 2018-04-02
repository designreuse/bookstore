package com.jshx.lbs.service.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface CarDataMapper {
    List searchCar(String carNo);
}
