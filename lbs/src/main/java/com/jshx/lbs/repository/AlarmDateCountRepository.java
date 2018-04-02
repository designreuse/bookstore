package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AlarmDateCountRepository extends JpaRepository<User, String> {

    @Query(value = "SELECT * FROM (select count(1) , alarm_type, to_char(a.alarm_date, 'yyyymm') " +
        "  from lbs.t_msg_alarminfo a  " +
        "  left join lbsbus.t_car b" +
        "    on a.keyid = b.key_id" +
        "  left join lbsbus.t_cargroup_car c" +
        "    on b.car_id = c.carid" +
        "  left join lbsbus.t_cargroup d" +
        "    on c.groupid = d.groupid" +
        " where (d.companyid = :companyId or :companyId = null) and (c.groupid in (:groupIdList) )" +
        " and (a.ALARM_DATE>to_date(:startTime,'yyyy-MM-dd hh24:mi:ss') or :startTime IS NULL) and (a.ALARM_DATE<to_date(:endTime,'yyyy-MM-dd hh24:mi:ss') or :endTime is NULL)" +
        " and (a.alarm_type in (:AlarmTypeList) ) " +
        " group by a.alarm_type, to_char(a.alarm_date, 'yyyymm') order by to_char(a.alarm_date, 'yyyymm')) t1" +
        " union all" +
        " SELECT * FROM (select count(1), -1, to_char(a.alarm_date, 'yyyymm')" +
        "  from lbs.t_msg_alarminfo a" +
        "  left join lbsbus.t_car b" +
        "    on a.keyid = b.key_id" +
        "  left join lbsbus.t_cargroup_car c" +
        "    on b.car_id = c.carid" +
        "  left join lbsbus.t_cargroup d" +
        "    on c.groupid = d.groupid" +
        " where (d.companyid = :companyId or :companyId = null) and (c.groupid in (:groupIdList))" +
        " and (a.ALARM_DATE>to_date(:startTime,'yyyy-MM-dd hh24:mi:ss') or :startTime IS NULL) and (a.ALARM_DATE<to_date(:endTime,'yyyy-MM-dd hh24:mi:ss') or :endTime is NULL)" +
        " and (a.alarm_type in (:AlarmTypeList) ) " +
        " group by to_char(a.alarm_date, 'yyyymm') order by to_char(a.alarm_date, 'yyyymm') ) t2",nativeQuery = true)
    List getAlarmDataCountForYear(@Param("companyId") String companyId,@Param("groupIdList") List<String> groupIdList,@Param("AlarmTypeList") List<String> AlarmTypeList,@Param("startTime")String startTime,@Param("endTime")String endTime);


    @Query(value = "SELECT * FROM (select count(1) , alarm_type, to_char(a.alarm_date, 'yyyymmdd') " +
        "  from lbs.t_msg_alarminfo a  " +
        "  left join lbsbus.t_car b" +
        "    on a.keyid = b.key_id" +
        "  left join lbsbus.t_cargroup_car c" +
        "    on b.car_id = c.carid" +
        "  left join lbsbus.t_cargroup d" +
        "    on c.groupid = d.groupid" +
        " where (d.companyid = :companyId or :companyId = null) and (c.groupid in (:groupIdList) )" +
        " and (a.ALARM_DATE>to_date(:startTime,'yyyy-MM-dd hh24:mi:ss') or :startTime IS NULL) and (a.ALARM_DATE<to_date(:endTime,'yyyy-MM-dd hh24:mi:ss') or :endTime is NULL)" +
        " and (a.alarm_type in (:AlarmTypeList) ) " +
        " group by a.alarm_type, to_char(a.alarm_date, 'yyyymmdd') order by to_char(a.alarm_date, 'yyyymmdd')) t1" +
        " union all" +
        " SELECT * FROM (select count(1), -1, to_char(a.alarm_date, 'yyyymmdd')" +
        "  from lbs.t_msg_alarminfo a" +
        "  left join lbsbus.t_car b" +
        "    on a.keyid = b.key_id" +
        "  left join lbsbus.t_cargroup_car c" +
        "    on b.car_id = c.carid" +
        "  left join lbsbus.t_cargroup d" +
        "    on c.groupid = d.groupid" +
        " where (d.companyid = :companyId or :companyId = null) and (c.groupid in (:groupIdList))" +
        " and (a.ALARM_DATE>to_date(:startTime,'yyyy-MM-dd hh24:mi:ss') or :startTime IS NULL) and (a.ALARM_DATE<to_date(:endTime,'yyyy-MM-dd hh24:mi:ss') or :endTime is NULL)" +
        " and (a.alarm_type in (:AlarmTypeList) ) " +
        " group by to_char(a.alarm_date, 'yyyymmdd') order by to_char(a.alarm_date, 'yyyymmdd') ) t2",nativeQuery = true)
    List getAlarmDataCountForDay(@Param("companyId") String companyId,@Param("groupIdList") List<String> groupIdList,@Param("AlarmTypeList") List<String> AlarmTypeList,@Param("startTime")String startTime,@Param("endTime")String endTime);


    @Query(value = "select count(1), alarm_type " +
        "  from lbs.t_msg_alarminfo a" +
        "  left join lbsbus.t_car b" +
        "    on a.keyid = b.key_id" +
        "  left join lbsbus.t_cargroup_car c" +
        "    on b.car_id = c.carid" +
        "  left join lbsbus.t_cargroup d" +
        "    on c.groupid = d.groupid" +
        " where (d.companyid = :companyId or :companyId = null) and c.groupid in (:groupIdList)" +
        " and (a.ALARM_DATE like %:Time% or :Time IS NULL)" +
        " and a.alarm_type in (:AlarmTypeList)" +
        " group by a.alarm_type",nativeQuery = true)
    List getAlarmDataCountPicture(@Param("companyId")String companyId,@Param("groupIdList")List<String> groupIdList,@Param("AlarmTypeList")List<String> AlarmTypeList,@Param("Time")String Time);
}
