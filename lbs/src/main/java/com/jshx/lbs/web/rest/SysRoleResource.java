package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.SysPrivilege;
import com.jshx.lbs.domain.SysRole;
import com.jshx.lbs.repository.SysPrivilegeRepository;
import com.jshx.lbs.repository.SysRoleRepository;
import com.jshx.lbs.web.rest.util.HeaderUtil;
import com.jshx.lbs.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing SysRole.
 */
@RestController
@RequestMapping("/api")
public class SysRoleResource {

    private final Logger log = LoggerFactory.getLogger(SysRoleResource.class);

    private static final String ENTITY_NAME = "sysRole";

    private final SysRoleRepository sysRoleRepository;
    private final SysPrivilegeRepository sysPrivilegeRepository;
    public SysRoleResource(SysRoleRepository sysRoleRepository,SysPrivilegeRepository sysPrivilegeRepository) {
        this.sysRoleRepository = sysRoleRepository;
        this.sysPrivilegeRepository=sysPrivilegeRepository;
    }

    private static String privilegeName;

    /**
     * POST  /sys-roles : Create a new sysRole.
     *
     * @param sysRole the sysRole to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sysRole, or with status 400 (Bad Request) if the sysRole has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sys-roles")
    @Timed
    public ResponseEntity<SysRole> createSysRole(@RequestBody SysRole sysRole) throws URISyntaxException {
        log.debug("REST request to save SysRole : {}", sysRole);
        if (sysRole.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sysRole cannot already have an ID")).body(null);
        }
        SysPrivilege sysPrivilege=sysPrivilegeRepository.findById("402882b55ec22547015ec229d3300001");
        Set<SysPrivilege> privilegeSet =new HashSet<>();
        privilegeSet.add(sysPrivilege);
        sysRole.setSysPrivileges(privilegeSet);
        SysRole result = sysRoleRepository.save(sysRole);
        return ResponseEntity.created(new URI("/api/sys-roles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sys-roles : Updates an existing sysRole.
     *
     * @param sysRole the sysRole to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sysRole,
     * or with status 400 (Bad Request) if the sysRole is not valid,
     * or with status 500 (Internal Server Error) if the sysRole couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sys-roles")
    @Timed
    public ResponseEntity<SysRole> updateSysRole(@RequestBody SysRole sysRole) throws URISyntaxException {
        log.debug("REST request to update SysRole : {}", sysRole);
        if (sysRole.getId() == null) {
            return createSysRole(sysRole);
        }
        SysRole result = sysRoleRepository.save(sysRole);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sysRole.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sys-roles : get all the sysRoles.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sysRoles in body
     */
    @GetMapping("/sys-roles")
    @Timed
    public ResponseEntity<List<SysRole>> getAllSysRoles(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of SysRoles");
        Page<SysRole> page = sysRoleRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sys-roles");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sys-roles/:id : get the "id" sysRole.
     *
     * @param id the id of the sysRole to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sysRole, or with status 404 (Not Found)
     */
    @GetMapping("/sys-roles/{id}")
    @Timed
    public ResponseEntity<SysRole> getSysRole(@PathVariable String id) {
        log.debug("REST request to get SysRole : {}", id);
        SysRole sysRole = sysRoleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sysRole));
    }

    /**
     * DELETE  /sys-roles/:id : delete the "id" sysRole.
     *
     * @param id the id of the sysRole to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sys-roles/{id}")
    @Timed
    public ResponseEntity<Void> deleteSysRole(@PathVariable String id) {
        log.debug("REST request to delete SysRole : {}", id);
        sysRoleRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/sys-roles/updateRolePrivilege")
    @Timed
    @ResponseBody
    public String updateRolePrivilegeByParam(@RequestParam(value = "privilegeId", required = false) String privilegeId,@RequestParam(value = "roleId", required = false) String roleId){
        String result = "添加失败";
        if(privilegeId != null && !privilegeId.isEmpty() && roleId != null && !roleId.isEmpty())
        {
            List resultList = sysPrivilegeRepository.findSysPrivilegeByRoleId(roleId, privilegeId);
            if(resultList != null&&resultList.size() > 0)
            {//用户已经拥有该角色，不需要修改数据库
                result = "角色权限添加成功!";
            }else
            {//不存在时，新增用户角色关联关系
                sysPrivilegeRepository.addNewUserPrivilege(roleId, privilegeId);
                result = "角色权限添加成功!";
            }
        }
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }


    @PostMapping("/sys-roles/findRolePrivilegeName")
    @Timed
    public String findRolePrivilegeName(@RequestParam(value = "roleId", required = false) String roleId) {
        String result = "";
        this.privilegeName="";
        List resultList = sysPrivilegeRepository.findRolePrivilegeByParam(roleId);
        if(resultList != null && resultList.size() > 0)
        {
            resultList.stream().forEach(  privilege -> this.privilegeName += privilege + ",");
        }
        result=this.privilegeName;
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }

    @PostMapping("/sys-roles/deleteRolePrivilege")
    @Timed
    public String deleteRolePrivilegeByParam(@RequestParam(value = "roleId", required = false) String roleId,@RequestParam(value = "privilegeId", required = false) String privilegeId){
        String result = "删除失败";
        if(roleId != null && !roleId.isEmpty() && privilegeId != null && !privilegeId.isEmpty())
        {
            List resultList = sysPrivilegeRepository.findSysPrivilegeByRoleId(roleId, privilegeId);
            if(resultList != null&&resultList.size() > 0)
            {//用户拥有该角色
                sysPrivilegeRepository.deleteRolePrivilege(roleId, privilegeId);
                result = "角色权限删除成功!";
            }else
            {//不存在时
                result = "角色权限删除失败!";
            }
        }
        return "{\"resultCode\":200 ,\"result\":\""+result+"\"}";
    }
}
