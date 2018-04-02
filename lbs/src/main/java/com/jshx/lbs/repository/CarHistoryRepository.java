package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public interface CarHistoryRepository extends JpaRepository<User,Long> {

    @Query(value = "select t.keyid,t.MSG_LATITUDE,t.MSG_LONGITUDE,t.MSG_SPEED,t.MSG_DISTANCE," +
        "t.MSG_DIRECTION,to_char(t.MSG_TIME_NEW,'yyyy-MM-dd hh24:mi:ss') MSG_TIME_NEW from " +
        "lbs.t_msg_recv_his t where 1=1 and t.keyid=:keyId  and t.MSG_TIME_NEW > to_date(:startTime,'yyyy-mm-dd hh24:mi:ss') " +
        "and t.MSG_TIME_NEW < to_date(:endTime,'yyyy-mm-dd hh24:mi:ss') and t.msg_latitude>0.000001 and " +
        "t.msg_latitude>0.000001 order by t.MSG_TIME_NEW ",nativeQuery = true)
    List findCarHistoryInfo(@Param("keyId") String keyId, @Param("startTime") String startTime, @Param("endTime") String endTime);

    @Query(value = "select key_id from lbsbus.t_car t where car_No =:carNo",nativeQuery = true)
    List findKeyIdByCarNo(@Param("carNo") String carNo);

    @Query(value = " select d.* from t_sys_user a left join t_sys_group_user b on  " +
        "a.user_id = b.userid left join t_cargroup_car c on b.GROUPID = c.GROUPID LEFT JOIN " +
        "t_car d on c.carid = d.car_id where a.USER_NAME =:userName and a.COMPANY_ID =:companyId and d.key_Id =:keyId",nativeQuery = true)
    List CheckuserCarBykeyId(@Param("keyId") String keyId, @Param("userName") String userName,@Param("companyId") String companyId);

    @Query(value = " select d.* from t_sys_user a left join t_sys_group_user b on  " +
        "a.user_id = b.userid left join t_cargroup_car c on b.GROUPID = c.GROUPID LEFT JOIN " +
        "t_car d on c.carid = d.car_id where a.USER_NAME =:userName and a.COMPANY_ID =:companyId and d.car_No =:carNo",nativeQuery = true)
    List CheckuserCarByCarNo(@Param("carNo") String carNo, @Param("userName") String userName,@Param("companyId") String companyId);

    //查询报警数据
    @Query(value="select t.alarm_date,t.alarminfo_longitude, t.alarminfo_latitude, t.alarm_desc,t.alarm_type " +
        "from lbs.t_msg_alarminfo t " +
        "where t.keyid = :keyId and t.alarm_date > " +
        "to_date(:startTime, 'yyyy-mm-dd hh24:mi:ss') " +
        "and t.alarm_date < " +
        "to_date(:endTime, 'yyyy-mm-dd hh24:mi:ss') " +
        "ORDER BY t.alarm_date ASC",nativeQuery = true)
    List queryAlarmData(@Param("keyId") String keyId, @Param("startTime") String startTime,@Param("endTime") String endTime);

}
