package com.jshx.lbs.web.rest;

import com.jshx.lbs.LbsApp;
import com.jshx.lbs.domain.SysPrivilege;
import com.jshx.lbs.repository.SysPrivilegeRepository;
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
 * Test class for the SysPrivilegeResource REST controller.
 *
 * @see SysPrivilegeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LbsApp.class)
public class SysPrivilegeResourceIntTest {

    private static final String DEFAULT_PRIVILEGE_PID = "AAAAAAAAAA";
    private static final String UPDATED_PRIVILEGE_PID = "BBBBBBBBBB";

    private static final String DEFAULT_PRIVILEGE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PRIVILEGE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANYID = "AAAAAAAAAA";
    private static final String UPDATED_COMPANYID = "BBBBBBBBBB";

    private static final String DEFAULT_PRIVILIGE_DESC = "AAAAAAAAAA";
    private static final String UPDATED_PRIVILIGE_DESC = "BBBBBBBBBB";

    private static final Integer DEFAULT_ISFLAG = 1;
    private static final Integer UPDATED_ISFLAG = 2;

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

    private MockMvc restSysPrivilegeMockMvc;

    private SysPrivilege sysPrivilege;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SysPrivilegeResource sysPrivilegeResource = new SysPrivilegeResource(sysPrivilegeRepository);
        this.restSysPrivilegeMockMvc = MockMvcBuilders.standaloneSetup(sysPrivilegeResource)
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
    public static SysPrivilege createEntity(EntityManager em) {
        SysPrivilege sysPrivilege = new SysPrivilege()
            .privilegePid(DEFAULT_PRIVILEGE_PID)
            .privilegeName(DEFAULT_PRIVILEGE_NAME)
            .companyid(DEFAULT_COMPANYID)
            .priviligeDesc(DEFAULT_PRIVILIGE_DESC)
            .isflag(DEFAULT_ISFLAG);
        return sysPrivilege;
    }

    @Before
    public void initTest() {
        sysPrivilege = createEntity(em);
    }

    @Test
    @Transactional
    public void createSysPrivilege() throws Exception {
        int databaseSizeBeforeCreate = sysPrivilegeRepository.findAll().size();

        // Create the SysPrivilege
        restSysPrivilegeMockMvc.perform(post("/api/sys-privileges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysPrivilege)))
            .andExpect(status().isCreated());

        // Validate the SysPrivilege in the database
        List<SysPrivilege> sysPrivilegeList = sysPrivilegeRepository.findAll();
        assertThat(sysPrivilegeList).hasSize(databaseSizeBeforeCreate + 1);
        SysPrivilege testSysPrivilege = sysPrivilegeList.get(sysPrivilegeList.size() - 1);
        assertThat(testSysPrivilege.getPrivilegePid()).isEqualTo(DEFAULT_PRIVILEGE_PID);
        assertThat(testSysPrivilege.getPrivilegeName()).isEqualTo(DEFAULT_PRIVILEGE_NAME);
        assertThat(testSysPrivilege.getCompanyid()).isEqualTo(DEFAULT_COMPANYID);
        assertThat(testSysPrivilege.getPriviligeDesc()).isEqualTo(DEFAULT_PRIVILIGE_DESC);
        assertThat(testSysPrivilege.getIsflag()).isEqualTo(DEFAULT_ISFLAG);
    }

    @Test
    @Transactional
    public void createSysPrivilegeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sysPrivilegeRepository.findAll().size();

        // Create the SysPrivilege with an existing ID
        sysPrivilege.setId("1");

        // An entity with an existing ID cannot be created, so this API call must fail
        restSysPrivilegeMockMvc.perform(post("/api/sys-privileges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysPrivilege)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<SysPrivilege> sysPrivilegeList = sysPrivilegeRepository.findAll();
        assertThat(sysPrivilegeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSysPrivileges() throws Exception {
        // Initialize the database
        sysPrivilegeRepository.saveAndFlush(sysPrivilege);

        // Get all the sysPrivilegeList
        restSysPrivilegeMockMvc.perform(get("/api/sys-privileges?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sysPrivilege.getId().toString())))
            .andExpect(jsonPath("$.[*].privilegePid").value(hasItem(DEFAULT_PRIVILEGE_PID.toString())))
            .andExpect(jsonPath("$.[*].privilegeName").value(hasItem(DEFAULT_PRIVILEGE_NAME.toString())))
            .andExpect(jsonPath("$.[*].companyid").value(hasItem(DEFAULT_COMPANYID.toString())))
            .andExpect(jsonPath("$.[*].priviligeDesc").value(hasItem(DEFAULT_PRIVILIGE_DESC.toString())))
            .andExpect(jsonPath("$.[*].isflag").value(hasItem(DEFAULT_ISFLAG)));
    }

    @Test
    @Transactional
    public void getSysPrivilege() throws Exception {
        // Initialize the database
        sysPrivilegeRepository.saveAndFlush(sysPrivilege);

        // Get the sysPrivilege
        restSysPrivilegeMockMvc.perform(get("/api/sys-privileges/{id}", sysPrivilege.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sysPrivilege.getId().toString()))
            .andExpect(jsonPath("$.privilegePid").value(DEFAULT_PRIVILEGE_PID.toString()))
            .andExpect(jsonPath("$.privilegeName").value(DEFAULT_PRIVILEGE_NAME.toString()))
            .andExpect(jsonPath("$.companyid").value(DEFAULT_COMPANYID.toString()))
            .andExpect(jsonPath("$.priviligeDesc").value(DEFAULT_PRIVILIGE_DESC.toString()))
            .andExpect(jsonPath("$.isflag").value(DEFAULT_ISFLAG));
    }

    @Test
    @Transactional
    public void getNonExistingSysPrivilege() throws Exception {
        // Get the sysPrivilege
        restSysPrivilegeMockMvc.perform(get("/api/sys-privileges/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSysPrivilege() throws Exception {
        // Initialize the database
        sysPrivilegeRepository.saveAndFlush(sysPrivilege);
        int databaseSizeBeforeUpdate = sysPrivilegeRepository.findAll().size();

        // Update the sysPrivilege
        SysPrivilege updatedSysPrivilege = sysPrivilegeRepository.findById(sysPrivilege.getId());
        updatedSysPrivilege
            .privilegePid(UPDATED_PRIVILEGE_PID)
            .privilegeName(UPDATED_PRIVILEGE_NAME)
            .companyid(UPDATED_COMPANYID)
            .priviligeDesc(UPDATED_PRIVILIGE_DESC)
            .isflag(UPDATED_ISFLAG);

        restSysPrivilegeMockMvc.perform(put("/api/sys-privileges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSysPrivilege)))
            .andExpect(status().isOk());

        // Validate the SysPrivilege in the database
        List<SysPrivilege> sysPrivilegeList = sysPrivilegeRepository.findAll();
        assertThat(sysPrivilegeList).hasSize(databaseSizeBeforeUpdate);
        SysPrivilege testSysPrivilege = sysPrivilegeList.get(sysPrivilegeList.size() - 1);
        assertThat(testSysPrivilege.getPrivilegePid()).isEqualTo(UPDATED_PRIVILEGE_PID);
        assertThat(testSysPrivilege.getPrivilegeName()).isEqualTo(UPDATED_PRIVILEGE_NAME);
        assertThat(testSysPrivilege.getCompanyid()).isEqualTo(UPDATED_COMPANYID);
        assertThat(testSysPrivilege.getPriviligeDesc()).isEqualTo(UPDATED_PRIVILIGE_DESC);
        assertThat(testSysPrivilege.getIsflag()).isEqualTo(UPDATED_ISFLAG);
    }

    @Test
    @Transactional
    public void updateNonExistingSysPrivilege() throws Exception {
        int databaseSizeBeforeUpdate = sysPrivilegeRepository.findAll().size();

        // Create the SysPrivilege

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSysPrivilegeMockMvc.perform(put("/api/sys-privileges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysPrivilege)))
            .andExpect(status().isCreated());

        // Validate the SysPrivilege in the database
        List<SysPrivilege> sysPrivilegeList = sysPrivilegeRepository.findAll();
        assertThat(sysPrivilegeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSysPrivilege() throws Exception {
        // Initialize the database
        sysPrivilegeRepository.saveAndFlush(sysPrivilege);
        int databaseSizeBeforeDelete = sysPrivilegeRepository.findAll().size();

        // Get the sysPrivilege
        restSysPrivilegeMockMvc.perform(delete("/api/sys-privileges/{id}", sysPrivilege.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SysPrivilege> sysPrivilegeList = sysPrivilegeRepository.findAll();
        assertThat(sysPrivilegeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SysPrivilege.class);
        SysPrivilege sysPrivilege1 = new SysPrivilege();
        sysPrivilege1.setId("1");
        SysPrivilege sysPrivilege2 = new SysPrivilege();
        sysPrivilege2.setId(sysPrivilege1.getId());
        assertThat(sysPrivilege1).isEqualTo(sysPrivilege2);
        sysPrivilege2.setId("2");
        assertThat(sysPrivilege1).isNotEqualTo(sysPrivilege2);
        sysPrivilege1.setId(null);
        assertThat(sysPrivilege1).isNotEqualTo(sysPrivilege2);
    }
}
