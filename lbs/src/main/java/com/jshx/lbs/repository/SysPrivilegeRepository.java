package com.jshx.lbs.repository;

import com.jshx.lbs.domain.SysPrivilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Spring Data JPA repository for the SysPrivilege entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SysPrivilegeRepository extends JpaRepository<SysPrivilege, Long> {

    SysPrivilege findById(String id);

    @Modifying
    @Transactional
    void deleteById(String id);

    @Query(value = " select  role_id ,privilege_Id from t_sys_roleprivilege where  privilege_Id =:privilegeId and role_id =:roleId ", nativeQuery = true)
    List findSysPrivilegeByRoleId(@Param("roleId") String roleId , @Param("privilegeId") String privilegeId);

    @Modifying
    @Transactional
    @Query(value = "INSERT into t_sys_roleprivilege(role_id ,privilege_Id) VALUES (:roleId ,:privilegeId)", nativeQuery = true)
    void addNewUserPrivilege(@Param("roleId") String roleId , @Param("privilegeId") String privilegeId);

    @Query(value = "select r.privilege_name from t_sys_roleprivilege t  join t_sys_privilege r on t.privilege_id = r.privilege_id where t.role_id = :roleId", nativeQuery = true)
    List findRolePrivilegeByParam(@Param("roleId") String roleId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_sys_roleprivilege WHERE role_Id =:roleId and privilege_Id =:privilegeId", nativeQuery = true)
    void deleteRolePrivilege(@Param("roleId") String roleId,@Param("privilegeId") String privilegeId);

}
