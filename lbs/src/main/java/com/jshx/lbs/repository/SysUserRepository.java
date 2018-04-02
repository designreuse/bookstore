package com.jshx.lbs.repository;

import com.jshx.lbs.domain.SysUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


/**
 * Spring Data JPA repository for the SysUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SysUserRepository extends JpaRepository<SysUser, Long> {

    @EntityGraph(value="sysUser.all",type= EntityGraph.EntityGraphType.FETCH)
    SysUser findById(String id);

    @EntityGraph(value="sysUser.all",type= EntityGraph.EntityGraphType.FETCH)
    SysUser findAllByUserNameAndCompanyId(String userName,String companyId);

    @EntityGraph(value="sysUser.all",type= EntityGraph.EntityGraphType.FETCH)
    Optional<SysUser> findByUserNameAndCompanyId(String userName,String companyId);

    @Modifying
    @Transactional
    void deleteById(String id);


}
