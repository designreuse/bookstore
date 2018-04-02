package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreeArrayDataRepository extends JpaRepository<User,Long>
{

    @Query(value = "select t.company_id,t.company_name,t.company_fullname,t.company_sys_name,t.area_code,t.remark," +
        "t.car_default_icon,t.area_id,t.cmp_data_pri,t.company_type,t.video_server_ip," +
        "t.video_server_port from lbsbus.t_sys_company t where  t.company_id =:companyId",nativeQuery = true)
    List getCompanyInfo(@Param("companyId") String companyId);

    @Query(value = "select distinct(t.company_id) ,t.company_name,t.company_fullname,t.video_server_ip,t.video_server_port," +
        "t.area_id from lbsbus.t_sys_company t where t.company_id =:companyId",nativeQuery = true)
    List getCompanyList(@Param("companyId") String companyId);

    @Query(value = "select  distinct(t.groupid),t.companyid,t.groupname,t.createdby,t.pid," +
        "t.sort from lbsbus.t_cargroup t where t.companyId =:companyId",nativeQuery = true)
    List getGroupList(@Param("companyId") String companyId);

    @Query(value = "select v.CAR_NO, v.NO, v.KEY_ID, cp.groupid, pmt.term_status, o.online_status, " +
        "v.camera1 camcnt,o.v_hardware,v.car_id,to_char(pmt.create_time,'yyyy-MM-dd  HH24:mi:ss') create_time," +
        "to_char(pmt.last_recvtime,'yyyy-MM-dd HH24:mi:ss') last_recvtime " +
        "from lbsbus.t_car v " +
        "left join lbsbus.t_cargroup_car cp on v.car_id=cp.carid " +
        "left join lbs.t_pmt_register_term pmt on v.key_id = pmt.keyid " +
        "left join lbs.t_video_online_status o on v.KEY_ID=o.keyid " +
        "WHERE 1=1 and v.company_id =:companyId AND cp.groupid in (:groupList)",nativeQuery = true)
    List getCarByAut(@Param("companyId") String companyId,@Param("groupList") List<String> groupList);

    @Query(value = "SELECT t.groupid,t.groupname,t.pid,COUNT(1) TOTAL,sum(case when t.term_status=0 and t.online_status=0 then 1 else 0 end ) \"OFFLINE\"," +
        "sum( case when t.term_status!=0 or t.online_status!=0 then 1 else 0 end) \"ONLINE\"," +
        "sum( case when t.term_status!=0 then 1 else 0 end) \"GPSONLINE\"," +
        "sum( case when t.online_status!=0 then 1 else 0 end) \"VIDEOONLINE\"," +
        "t.sort,t.comid from lbsbus.v_pmt_vcar t WHERE t.COMPANY_ID =:companyId " +
        "group by t.groupid,t.groupname,t.pid,t.sort,t.comid",nativeQuery = true)
    List findCarOnlineData(@Param("companyId") String companyId);

    @Query(value = "select groupid, pid,case when level = 1 then '  '||groupname else case when level=2 " +
        "then '    '||groupname else '        '||groupname  END end groupname,LEVEL,connect_by_isleaf DATALEAF,grouplevel," +
        "sort from lbsbus.t_cargroup t WHERE 1=1 and t.companyid =:companyId connect by prior t.groupid =t.pid start with " +
        "t.pid IS NULL",nativeQuery = true)
    List findCarOnlineGroupData(@Param("companyId") String companyId);

    @Query(value = "select t.groupid, t.groupname, t.companyid, t.createdby, " +
        "t.pid,t.sort,t.grouplevel from lbsbus.t_cargroup t where 1=1 and t.companyid =:companyId",nativeQuery = true)
    List getAllGroupByCompany(@Param("companyId") String companyId);

    @Query(value = "select t1.keyId, t1.LAST_TIME, t1.LAST_LATITUDE, t1.LAST_LONGITUDE, t1.LAST_SPEED, t1.term_status,t1.last_altitude, " +
        "t2.car_type, t2.car_no, t2.platecolor,t3.d_name,t3.d_mobile " +
        "from lbs.t_pmt_register_term t1 " +
        "left join t_car t2 on t1.keyId = t2.key_Id  left join t_driver t3 ON t2.car_driver_name =t3.d_id " +
        "where 1=1 and t1.keyId in (:keyId)",nativeQuery = true)
    List getRealTimeInformation (@Param("keyId") List<String> keyId);

    //根据userName和companyid查userid
    @Query(value = "select t.user_id from lbsbus.t_sys_user t where 1=1 and t.user_name=:userName and t.company_id=:companyId",nativeQuery = true)
    List getUserId(@Param("userName") String userName,@Param("companyId") String companyId);

    //根据companyid和userid查groupid
    @Query(value = "select t.groupid from lbsbus.t_sys_group_user t join lbsbus.t_cargroup p  on t.groupid = p.groupid  and p.companyid = :companyId where 1 = 1  and  t.userid =:userId " +
        "union select  t.groupid from t_cargroup t where t.companyid =:companyId connect by prior t.groupid =t.pid start with t.pid is null " +
        "minus select t.groupid from t_cargroup t where t.companyid=:companyId and not exists(select 1 from t_cargroup_car a where t.groupid=a.groupid) ",nativeQuery = true)
    List getGroupId(@Param("userId") String userId,@Param("companyId") String companyId);

    //找到对应的getGroupByAut
    @Query(value="select groupid, pid, companyid, groupname,sort,grouplevel from lbsbus.t_cargroup t start with " +
        "t.companyid =:companyId and t.groupid in (:groupList) connect by prior t.pid = t.groupid and t.pid not in (:groupList) " +
        "union select  groupid, pid, companyid, groupname,sort,grouplevel from t_cargroup t  where t.companyid =:companyId " +
        "connect by prior  t.groupid =t.pid start with t.pid is null",nativeQuery = true)
    List getGroupByAut(@Param("companyId") String companyId,@Param("groupList") List<String> groupList);


    //根据keyId查carId
    @Query(value="select t.car_id,t.key_id from t_car t where t.key_id in (:keyIdList) and t.company_id=:companyId",nativeQuery = true)
    List getCarIdList(@Param("keyIdList") List<String> keyIdList,@Param("companyId") String companyId);

    //sql查询出carid
    @Query(value="select t.carid from lbsbus.t_cargroup_car t where t.groupid in (:groupList)",nativeQuery = true)
    List getCarIdListByGroup(@Param("groupList") List<String> groupList);

    //根据carId查groupid
    @Query(value="select t.groupid from lbsbus.t_cargroup_car t where t.carid=:carId",nativeQuery = true)
    List getCarGroupId(@Param("carId") String carId);

    //根据carId查keyId
    @Query(value = "select t.key_id from lbsbus.t_car t where t.car_id=:carId",nativeQuery = true)
    List getKeyByCar(@Param("carId") String carId);

    //根据carid查keyId和groupId
    @Query(value="select t.key_id , t.car_id ,v.groupid from lbsbus.t_car t " +
        "left join lbsbus.t_cargroup_car v on t.car_Id = v.carId " +
        "where 1=1 and t.car_id in (:carIdList)",nativeQuery = true)
    List getKeyAndGroup(@Param("carIdList") List<String> carIdList);
}
