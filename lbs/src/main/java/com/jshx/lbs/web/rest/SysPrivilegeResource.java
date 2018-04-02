package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.SysPrivilege;
import com.jshx.lbs.repository.SysPrivilegeRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing SysPrivilege.
 */
@RestController
@RequestMapping("/api")
public class SysPrivilegeResource {

    private final Logger log = LoggerFactory.getLogger(SysPrivilegeResource.class);

    private static final String ENTITY_NAME = "sysPrivilege";

    private final SysPrivilegeRepository sysPrivilegeRepository;
    public SysPrivilegeResource(SysPrivilegeRepository sysPrivilegeRepository) {
        this.sysPrivilegeRepository = sysPrivilegeRepository;
    }

    /**
     * POST  /sys-privileges : Create a new sysPrivilege.
     *
     * @param sysPrivilege the sysPrivilege to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sysPrivilege, or with status 400 (Bad Request) if the sysPrivilege has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sys-privileges")
    @Timed
    public ResponseEntity<SysPrivilege> createSysPrivilege(@Valid @RequestBody SysPrivilege sysPrivilege) throws URISyntaxException {
        log.debug("REST request to save SysPrivilege : {}", sysPrivilege);
        if (sysPrivilege.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sysPrivilege cannot already have an ID")).body(null);
        }
        SysPrivilege result = sysPrivilegeRepository.save(sysPrivilege);
        return ResponseEntity.created(new URI("/api/sys-privileges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sys-privileges : Updates an existing sysPrivilege.
     *
     * @param sysPrivilege the sysPrivilege to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sysPrivilege,
     * or with status 400 (Bad Request) if the sysPrivilege is not valid,
     * or with status 500 (Internal Server Error) if the sysPrivilege couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sys-privileges")
    @Timed
    public ResponseEntity<SysPrivilege> updateSysPrivilege(@Valid @RequestBody SysPrivilege sysPrivilege) throws URISyntaxException {
        log.debug("REST request to update SysPrivilege : {}", sysPrivilege);
        if (sysPrivilege.getId() == null) {
            return createSysPrivilege(sysPrivilege);
        }
        SysPrivilege result = sysPrivilegeRepository.save(sysPrivilege);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sysPrivilege.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sys-privileges : get all the sysPrivileges.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sysPrivileges in body
     */
    @GetMapping("/sys-privileges")
    @Timed
    public ResponseEntity<List<SysPrivilege>> getAllSysPrivileges(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of SysPrivileges");
        Page<SysPrivilege> page = sysPrivilegeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sys-privileges");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sys-privileges/:id : get the "id" sysPrivilege.
     *
     * @param id the id of the sysPrivilege to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sysPrivilege, or with status 404 (Not Found)
     */
    @GetMapping("/sys-privileges/{id}")
    @Timed
    public ResponseEntity<SysPrivilege> getSysPrivilege(@PathVariable String id) {
        log.debug("REST request to get SysPrivilege : {}", id);
        SysPrivilege sysPrivilege = sysPrivilegeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sysPrivilege));
    }

    /**
     * DELETE  /sys-privileges/:id : delete the "id" sysPrivilege.
     *
     * @param id the id of the sysPrivilege to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sys-privileges/{id}")
    @Timed
    public ResponseEntity<Void> deleteSysPrivilege(@PathVariable String id) {
        log.debug("REST request to delete SysPrivilege : {}", id);
        sysPrivilegeRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
