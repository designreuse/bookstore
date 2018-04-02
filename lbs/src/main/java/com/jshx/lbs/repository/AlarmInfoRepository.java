package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AlarmInfoRepository extends JpaRepository<User, String> {
    @Query(value = "select a.CAR_ID,a.CAR_NO,a.KEY_ID,a.PLATECOLOR,d.GROUPNAME,b.ALARM_TYPE,to_char(b.alarm_date,'yyyy-MM-dd hh24:mi:ss') ALARMDATE," +
        "round((b.ALARM_ENDDATE-b.ALARM_DATE)*24*60*60) DURATION,b.ALARM_SPEED from LBSBUS.T_CAR a LEFT JOIN lbs.t_msg_alarminfo b on a.KEY_ID = b.KEYID  LEFT JOIN T_CARGROUP_CAR c on a.CAR_ID = c.CARID " +
        "LEFT JOIN  T_CARGROUP d on c.GROUPID = d.GROUPID LEFT JOIN t_sys_group_user e  on d.GROUPID = e.GROUPID where (a.CAR_NO like %:carNo% or :carNo IS NULL) and (b.ALARM_TYPE = :alarmType or :alarmType = -1) " +
        "and (b.ALARM_DATE>to_date(:startTime,'yyyy-MM-dd hh24:mi:ss') or :startTime IS NULL) and (b.ALARM_DATE<to_date(:endTime,'yyyy-MM-dd hh24:mi:ss') or :endTime is NULL) and e.USERID =:useId order by b.ALARM_DATE desc", nativeQuery = true)
    List getAlarmInfo(@Param("carNo") String carNo, @Param("alarmType") int alarmType, @Param("startTime") String startTime, @Param("endTime") String endTime, @Param("useId") String useId);


    @Query(value = "select t.DICTVALUE,t.DESCRIPTION from dictionary t where t.dictid ='A3' and t.dictvalue in (0,94,97,157,158,161,220,221) ORDER  by dictvalue", nativeQuery = true)
    List getAlarmType();
}
