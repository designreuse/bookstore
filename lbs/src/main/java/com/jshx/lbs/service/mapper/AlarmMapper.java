package com.jshx.lbs.service.mapper;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AlarmMapper {

    List<Map> getAlarmDataCount(Map<String,Object> map);

    List<Map> getAlarmDataCountPicture(Map<String,Object> map);

    List<Map> getAlarmType(Map<String,Object> map);

    List<Map> getAlarmTypeById( String companyId,String AlarmType);

    List<Map> getAlarmForDriver(Map<String,Object> map);

    List<Map> searchAlarmForSupserMan(Map<String,Object> map);

    List<Map> searchAlarm(Map<String,Object> map);

    List<Map> getAlarmEvaluation(Map<String,Object> map);
    List<Map>  getAlarmEvaluationForCompany(Map<String,Object> map);

    List<Map> getAlarmInfo(Map<String,Object> map);

    List<Map> getAlarmInfoByPage(Map<String,Object> map);

    void dealAlarm(Map map);

    int updateAlarmTreat(Map map);

    void saveAlarmLog(Map<String,Object>Param);

    List<Map>searchAlarmLog(Map<String,Object>Param);

    public List<Map> getAlarmTreatInfoById(Map<String,Object> map);

    String getSuperGroupName(Map<String,Object>Param);

    public void alarmInfoAddAlarmNO (Map<String,Object> map);

    public void alarmTreatAddAlarmNO(Map<String,Object> map);

    public List<Map> getMediaJSONForType(Map<String,Object> map);
}
