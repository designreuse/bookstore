package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.SysRole;
import com.jshx.lbs.domain.SysUser;
import com.jshx.lbs.repository.SysRoleRepository;
import com.jshx.lbs.repository.SysUserRepository;
import com.jshx.lbs.web.rest.util.CodeUtil;
import com.jshx.lbs.web.rest.util.HeaderUtil;
import com.jshx.lbs.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing SysUser.
 */
@RestController
@RequestMapping("/api")
public class SysUserResource {

    private final Logger log = LoggerFactory.getLogger(SysUserResource.class);

    private static final String ENTITY_NAME = "sysUser";


    private final PasswordEncoder passwordEncoder;

    private final SysRoleRepository sysRoleRepository;

    private final SysUserRepository sysUserRepository;
    public SysUserResource(SysUserRepository sysUserRepository,SysRoleRepository sysRoleRepository, PasswordEncoder passwordEncoder) {
        this.sysUserRepository = sysUserRepository;
        this.sysRoleRepository=sysRoleRepository;
        this.passwordEncoder =passwordEncoder;
    }

    private static String roleName;

    /**
     * POST  /sys-users : Create a new sysUser.
     *
     * @param sysUser the sysUser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sysUser, or with status 400 (Bad Request) if the sysUser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sys-users")
    @Timed
    public ResponseEntity<SysUser> createSysUser(@Valid @RequestBody (required=false) SysUser sysUser) throws URISyntaxException {
        log.debug("REST request to save SysUser : {}", sysUser);
            if (sysUser.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sysUser cannot already have an ID")).body(null);
        }

        SysRole sysRole=sysRoleRepository.findById("402882b55ec262cb015ec26389cc0000");
        Set<SysRole> roleSet =new HashSet<>();
        if(sysRole != null)
        {
            roleSet.add(sysRole);
            sysUser.setSysRoles(roleSet);
        }


//        String encryptedPassword = passwordEncoder.encode(sysUser.getUserPwd());
        String encryptedPassword = CodeUtil.encode(sysUser.getUserPwd(), "MD5");
            sysUser.setUserPwd(encryptedPassword);
        SysUser result = sysUserRepository.save(sysUser);

        return ResponseEntity.created(new URI("/api/sys-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sys-users : Updates an existing sysUser.
     *
     * @param sysUser the sysUser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sysUser,
     * or with status 400 (Bad Request) if the sysUser is not valid,
     * or with status 500 (Internal Server Error) if the sysUser couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sys-users")
    @Timed
    public ResponseEntity<SysUser> updateSysUser(@Valid @RequestBody SysUser sysUser) throws URISyntaxException {
        log.debug("REST request to update SysUser : {}", sysUser);
        if (sysUser.getId() == null) {
            return createSysUser(sysUser);
        }
        SysUser result = sysUserRepository.save(sysUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sysUser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sys-users : get all the sysUsers.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sysUsers in body
     */
    @GetMapping("/sys-users")
    @Timed
    public ResponseEntity<List<SysUser>> getAllSysUsers(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of SysUsers");
        Page<SysUser> page = sysUserRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sys-users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sys-users/:id : get the "id" sysUser.
     *
     * @param id the id of the sysUser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sysUser, or with status 404 (Not Found)
     */
    @GetMapping("/sys-users/{id}")
    @Timed
    public ResponseEntity<SysUser> getSysUser(@PathVariable String id) {
        log.debug("REST request to get SysUser : {}", id);
        SysUser sysUser = sysUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sysUser));
    }

    /**
     * DELETE  /sys-users/:id : delete the "id" sysUser.
     *
     * @param id the id of the sysUser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sys-users/{id}")
    @Timed
    public ResponseEntity<Void> deleteSysUser(@PathVariable String id) {
        log.debug("REST request to delete SysUser : {}", id);
        sysUserRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/sys-users/updateUserRole")
    @Timed
    public String updateUserRoleByParam(@RequestParam(value = "userId", required = false) String userId,@RequestParam(value = "roleId", required = false) String roleId){
        String result = "添加失败";
        if(userId != null && !userId.isEmpty() && roleId != null && !roleId.isEmpty())
        {
            List resultList = sysRoleRepository.searchUserIdByRoleId(userId, roleId);
            if(resultList != null&&resultList.size() > 0)
            {//用户已经拥有该角色，不需要修改数据库
                result = "用户角色添加成功!";
            }else
            {//不存在时，新增用户角色关联关系
                sysRoleRepository.addNewUserRole(userId, roleId);
                result = "用户角色添加成功!";
            }
        }
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }


    @PostMapping("/sys-users/findUserRoleName")
    @Timed
    public String findUserRoleName(@RequestParam(value = "userId", required = false) String userId) {
        String result = "";
        this.roleName="";
        List resultList = sysRoleRepository.findUserRoleNameByParam(userId);
        if(resultList != null && resultList.size() > 0)
        {
           resultList.stream().forEach(  role -> this.roleName += role + ",");
        }
        result=this.roleName;
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }

    @PostMapping("/sys-users/deleteUserRole")
    @Timed
    public String deleteUserRoleByParam(@RequestParam(value = "userId", required = false) String userId,@RequestParam(value = "roleId", required = false) String roleId){
        String result = "删除失败";
        if(userId != null && !userId.isEmpty() && roleId != null && !roleId.isEmpty())
        {
            List resultList = sysRoleRepository.searchUserIdByRoleId(userId, roleId);
            if(resultList != null&&resultList.size() > 0)
            {//用户拥有该角色
                sysRoleRepository.deleteUserRole(userId, roleId);
                result = "用户角色删除成功!";
            }else
            {//不存在时
                result = "用户角色删除失败!";
            }
        }
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }


}
