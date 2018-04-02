package com.jshx.lbs.repository;

import com.jshx.lbs.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface CarInfoRepository extends JpaRepository<User, String> {
    @Query(value = "select a.CAR_ID,a.CAR_NO,a.KEY_ID,c.GROUPNAME,a.PLATECOLOR from T_CAR a LEFT JOIN T_CARGROUP_CAR b on a.CAR_ID = b.CARID" +
        " LEFT JOIN  T_CARGROUP c on b.GROUPID = c.GROUPID LEFT JOIN t_sys_group_user d  on c.GROUPID = d.GROUPID  " +
    " where (a.CAR_NO like %:carNo%  or :carNo IS NULL) and (c.GROUPNAME like %:groupName% or :groupName IS NULL)and d.USERID =:useId",nativeQuery = true)
    List findCarInfo(@Param("carNo") String carNo, @Param("groupName") String groupName, @Param("useId") String useId);
    }
