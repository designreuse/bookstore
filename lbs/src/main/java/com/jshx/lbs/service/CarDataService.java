package com.jshx.lbs.service;

import com.jshx.lbs.service.mapper.CarDataMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("CarDataMapper")
@Transactional
public class CarDataService implements CarDataMapper {
    @Autowired
    private CarDataMapper carDataMapper;
    @Override
    public List searchCar(String carNo) {
        return carDataMapper.searchCar(carNo);
    }
}
