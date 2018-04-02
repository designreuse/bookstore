package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BasicDataRepository extends JpaRepository<User,Long>
{
    //根据carNo模糊查询车辆信息
    @Query(value="select d.car_no, d.key_id, d.platecolor, e.last_time, f.groupname " +
        "  from t_sys_user a " +
        "  left join t_sys_group_user b " +
        "    on a.user_id = b.userid " +
        "  left join lbsbus.t_cargroup_car c " +
        "    on b.GROUPID = c.GROUPID " +
        "  left join lbsbus.t_car d " +
        "    on c.carid = d.car_id " +
        "  left join lbs.t_pmt_register_term e " +
        "    on d.key_id = e.keyid " +
        "  left join lbsbus.t_cargroup f " +
        "    on c.groupid = f.groupid " +
        " where d.car_no like %:carNo% " +
        "   and a.user_name = :userName " +
        "   and a.company_id = :companyId",nativeQuery = true)
    List queryCarBaseDataLikely(@Param("carNo") String carNo,@Param("userName") String userName,@Param("companyId") String companyId);

    //根据List全查车辆信息
    @Query(value="select t1.car_no,t1.car_id,t1.key_id,t1.platecolor,t2.last_time,t3.groupid,t4.groupname from lbsbus.t_car t1 " +
        "left join lbs.t_pmt_register_term t2 on t1.key_id=t2.keyid " +
        "left join lbsbus.t_cargroup_car t3 on t1.car_id=t3.carid " +
        "left join lbsbus.t_cargroup t4 on t3.groupid=t4.groupid " +
        "where t1.car_no in (:carNoList)",nativeQuery = true)
    List findCarHisBaseData(@Param("carNoList") List<String> carNoList);

    //查找全部车牌号
    @Query(value="select t4.car_no from lbsbus.t_sys_user t1 " +
        "left join lbsbus.t_sys_group_user t2 on t1.user_id=t2.userid " +
        "left join t_cargroup_car t3 on t2.groupid=t3.groupid " +
        "left join lbsbus.t_car t4 on t3.carid=t4.car_id " +
        "where t1.user_name=:userName and company_id=:companyId",nativeQuery = true)
    List queryCarNoAll(@Param("userName") String userName , @Param("companyId") String companyId);
}
