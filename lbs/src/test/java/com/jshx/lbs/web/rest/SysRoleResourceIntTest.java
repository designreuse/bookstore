package com.jshx.lbs.web.rest;

import com.jshx.lbs.LbsApp;
import com.jshx.lbs.domain.SysRole;
import com.jshx.lbs.repository.SysPrivilegeRepository;
import com.jshx.lbs.repository.SysRoleRepository;
import com.jshx.lbs.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SysRoleResource REST controller.
 *
 * @see SysRoleLbsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LbsApp.class)
public class SysRoleResourceIntTest {

    private static final String DEFAULT_ROLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ROLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ROLE_PID = "AAAAAAAAAA";
    private static final String UPDATED_ROLE_PID = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_ID = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ROLE_DESC = "AAAAAAAAAA";
    private static final String UPDATED_ROLE_DESC = "BBBBBBBBBB";

    private static final Integer DEFAULT_ISSYS = 1;
    private static final Integer UPDATED_ISSYS = 2;

    private static final Integer DEFAULT_ROLE_DEEP = 1;
    private static final Integer UPDATED_ROLE_DEEP = 2;

    private static final String DEFAULT_ROLE_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ROLE_CODE = "BBBBBBBBBB";

    @Autowired
    private SysRoleRepository sysRoleRepository;

    @Autowired
    private SysPrivilegeRepository sysPrivilegeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSysRoleMockMvc;

    private SysRole sysRole;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SysRoleResource sysRoleResource = new SysRoleResource(sysRoleRepository,sysPrivilegeRepository);
        this.restSysRoleMockMvc = MockMvcBuilders.standaloneSetup(sysRoleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SysRole createEntity(EntityManager em) {
        SysRole sysRole = new SysRole()
            .roleName(DEFAULT_ROLE_NAME)
            .rolePid(DEFAULT_ROLE_PID)
            .companyId(DEFAULT_COMPANY_ID)
            .roleDesc(DEFAULT_ROLE_DESC)
            .issys(DEFAULT_ISSYS)
            .roleCode(DEFAULT_ROLE_CODE)
            .roleDeep(DEFAULT_ROLE_DEEP);
        return sysRole;
    }

    @Before
    public void initTest() {
        sysRole = createEntity(em);
    }

    @Test
    @Transactional
    public void createSysRole() throws Exception {
        int databaseSizeBeforeCreate = sysRoleRepository.findAll().size();

        // Create the SysRole
        restSysRoleMockMvc.perform(post("/api/sys-roles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysRole)))
            .andExpect(status().isCreated());

        // Validate the SysRole in the database
        List<SysRole> sysRoleList = sysRoleRepository.findAll();
        assertThat(sysRoleList).hasSize(databaseSizeBeforeCreate + 1);
        SysRole testSysRole = sysRoleList.get(sysRoleList.size() - 1);
        assertThat(testSysRole.getRoleName()).isEqualTo(DEFAULT_ROLE_NAME);
        assertThat(testSysRole.getRolePid()).isEqualTo(DEFAULT_ROLE_PID);
        assertThat(testSysRole.getCompanyId()).isEqualTo(DEFAULT_COMPANY_ID);
        assertThat(testSysRole.getRoleDesc()).isEqualTo(DEFAULT_ROLE_DESC);
        assertThat(testSysRole.getIssys()).isEqualTo(DEFAULT_ISSYS);
        assertThat(testSysRole.getRoleCode()).isEqualTo(DEFAULT_ROLE_CODE);
        assertThat(testSysRole.getRoleDeep()).isEqualTo(DEFAULT_ROLE_DEEP);
    }

    @Test
    @Transactional
    public void createSysRoleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sysRoleRepository.findAll().size();

        // Create the SysRole with an existing ID
        sysRole.setId("");

        // An entity with an existing ID cannot be created, so this API call must fail
        restSysRoleMockMvc.perform(post("/api/sys-roles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysRole)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<SysRole> sysRoleList = sysRoleRepository.findAll();
        assertThat(sysRoleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSysRoles() throws Exception {
        // Initialize the database
        sysRoleRepository.saveAndFlush(sysRole);

        // Get all the sysRoleList
        restSysRoleMockMvc.perform(get("/api/sys-roles?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sysRole.getId().toString())))
            .andExpect(jsonPath("$.[*].roleName").value(hasItem(DEFAULT_ROLE_NAME.toString())))
            .andExpect(jsonPath("$.[*].rolePid").value(hasItem(DEFAULT_ROLE_PID.toString())))
            .andExpect(jsonPath("$.[*].companyId").value(hasItem(DEFAULT_COMPANY_ID.toString())))
            .andExpect(jsonPath("$.[*].roleDesc").value(hasItem(DEFAULT_ROLE_DESC.toString())))
            .andExpect(jsonPath("$.[*].issys").value(hasItem(DEFAULT_ISSYS)))
            .andExpect(jsonPath("$.[*].roleCode").value(hasItem(DEFAULT_ROLE_CODE)))
            .andExpect(jsonPath("$.[*].roleDeep").value(hasItem(DEFAULT_ROLE_DEEP.toString())));
    }

    @Test
    @Transactional
    public void getSysRole() throws Exception {
        // Initialize the database
        sysRoleRepository.saveAndFlush(sysRole);

        // Get the sysRole
        restSysRoleMockMvc.perform(get("/api/sys-roles/{id}", sysRole.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sysRole.getId().toString()))
            .andExpect(jsonPath("$.roleName").value(DEFAULT_ROLE_NAME.toString()))
            .andExpect(jsonPath("$.rolePid").value(DEFAULT_ROLE_PID.toString()))
            .andExpect(jsonPath("$.companyId").value(DEFAULT_COMPANY_ID.toString()))
            .andExpect(jsonPath("$.roleDesc").value(DEFAULT_ROLE_DESC.toString()))
            .andExpect(jsonPath("$.issys").value(DEFAULT_ISSYS))
            .andExpect(jsonPath("$.roleCode").value(DEFAULT_ROLE_CODE))
            .andExpect(jsonPath("$.roleDeep").value(DEFAULT_ROLE_DEEP.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSysRole() throws Exception {
        // Get the sysRole
        restSysRoleMockMvc.perform(get("/api/sys-roles/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSysRole() throws Exception {
        // Initialize the database
        sysRoleRepository.saveAndFlush(sysRole);
        int databaseSizeBeforeUpdate = sysRoleRepository.findAll().size();

        // Update the sysRole
        SysRole updatedSysRole = sysRoleRepository.findOne(1L);
        updatedSysRole
            .roleName(UPDATED_ROLE_NAME)
            .rolePid(UPDATED_ROLE_PID)
            .companyId(UPDATED_COMPANY_ID)
            .roleDesc(UPDATED_ROLE_DESC)
            .issys(UPDATED_ISSYS)
            .roleCode(UPDATED_ROLE_CODE)
            .roleDeep(UPDATED_ROLE_DEEP);

        restSysRoleMockMvc.perform(put("/api/sys-roles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSysRole)))
            .andExpect(status().isOk());

        // Validate the SysRole in the database
        List<SysRole> sysRoleList = sysRoleRepository.findAll();
        assertThat(sysRoleList).hasSize(databaseSizeBeforeUpdate);
        SysRole testSysRole = sysRoleList.get(sysRoleList.size() - 1);
        assertThat(testSysRole.getRoleName()).isEqualTo(UPDATED_ROLE_NAME);
        assertThat(testSysRole.getRolePid()).isEqualTo(UPDATED_ROLE_PID);
        assertThat(testSysRole.getCompanyId()).isEqualTo(UPDATED_COMPANY_ID);
        assertThat(testSysRole.getRoleDesc()).isEqualTo(UPDATED_ROLE_DESC);
        assertThat(testSysRole.getIssys()).isEqualTo(UPDATED_ISSYS);
        assertThat(testSysRole.getRoleCode()).isEqualTo(UPDATED_ROLE_CODE);
        assertThat(testSysRole.getRoleDeep()).isEqualTo(UPDATED_ROLE_DEEP);
    }

    @Test
    @Transactional
    public void updateNonExistingSysRole() throws Exception {
        int databaseSizeBeforeUpdate = sysRoleRepository.findAll().size();

        // Create the SysRole

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSysRoleMockMvc.perform(put("/api/sys-roles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysRole)))
            .andExpect(status().isCreated());

        // Validate the SysRole in the database
        List<SysRole> sysRoleList = sysRoleRepository.findAll();
        assertThat(sysRoleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSysRole() throws Exception {
        // Initialize the database
        sysRoleRepository.saveAndFlush(sysRole);
        int databaseSizeBeforeDelete = sysRoleRepository.findAll().size();

        // Get the sysRole
        restSysRoleMockMvc.perform(delete("/api/sys-roles/{id}", sysRole.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SysRole> sysRoleList = sysRoleRepository.findAll();
        assertThat(sysRoleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SysRole.class);
        SysRole sysRole1 = new SysRole();
        sysRole1.setId("");
        SysRole sysRole2 = new SysRole();
        sysRole2.setId(sysRole1.getId());
        assertThat(sysRole1).isEqualTo(sysRole2);
        sysRole2.setId("");
        assertThat(sysRole1).isNotEqualTo(sysRole2);
        sysRole1.setId(null);
        assertThat(sysRole1).isNotEqualTo(sysRole2);
    }
}
