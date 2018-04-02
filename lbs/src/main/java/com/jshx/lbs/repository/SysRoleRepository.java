package com.jshx.lbs.repository;

import com.jshx.lbs.domain.SysRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Spring Data JPA repository for the SysRole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SysRoleRepository extends JpaRepository<SysRole, Long> {

    @EntityGraph(attributePaths = "sysPrivileges")
    SysRole findById(String id);

    @Modifying
    @Transactional
    void deleteById(String id);

    @Query(value = " select user_id, role_id from T_SYS_USERROLE where  user_id =:userId and role_id =:roleId ", nativeQuery = true)
    List searchUserIdByRoleId(@Param("userId") String userId,@Param("roleId") String roleId);

    @Modifying
    @Transactional
    @Query(value = "INSERT into T_SYS_USERROLE(user_Id,role_Id) VALUES (:userId,:roleId)", nativeQuery = true)
    void addNewUserRole(@Param("userId") String userId,@Param("roleId") String roleId);

    @Query(value = "select r.role_name from t_sys_userrole t join t_sys_role r on t.role_id=r.role_id where t.user_id=:userId", nativeQuery = true)
    List findUserRoleNameByParam(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM T_SYS_USERROLE WHERE user_Id =:userId and role_Id =:roleId", nativeQuery = true)
    void deleteUserRole(@Param("userId") String userId,@Param("roleId") String roleId);
}
