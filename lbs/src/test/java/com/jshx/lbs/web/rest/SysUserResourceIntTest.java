package com.jshx.lbs.web.rest;

import com.jshx.lbs.LbsApp;
import com.jshx.lbs.domain.SysUser;
import com.jshx.lbs.repository.SysRoleRepository;
import com.jshx.lbs.repository.SysUserRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SysUserResource REST controller.
 *
 * @see SysUserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LbsApp.class)
public class SysUserResourceIntTest {

    private static final String DEFAULT_COMPANY_ID = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_ID = "BBBBBBBBBB";

    private static final String DEFAULT_USER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_USER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_USER_PWD = "AAAAAAAAAA";
    private static final String UPDATED_USER_PWD = "BBBBBBBBBB";

    private static final String DEFAULT_USER_DESC = "AAAAAAAAAA";
    private static final String UPDATED_USER_DESC = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_LASTLOGINDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LASTLOGINDATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CREATEDBY = "AAAAAAAAAA";
    private static final String UPDATED_CREATEDBY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATEDON = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATEDON = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MODIFEDBY = "AAAAAAAAAA";
    private static final String UPDATED_MODIFEDBY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_MODIFEDON = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFEDON = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MODIFIEDBY = "AAAAAAAAAA";
    private static final String UPDATED_MODIFIEDBY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_MODIFIEDON = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFIEDON = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_USERPHONE = "AAAAAAAAAA";
    private static final String UPDATED_USERPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_LASTLOGINGROUP = "AAAAAAAAAA";
    private static final String UPDATED_LASTLOGINGROUP = "BBBBBBBBBB";

    private static final String DEFAULT_GROUPID = "AAAAAAAAAA";
    private static final String UPDATED_GROUPID = "BBBBBBBBBB";

    private static final String DEFAULT_REALNAME = "AAAAAAAAAA";
    private static final String UPDATED_REALNAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_STATUS = 1;
    private static final Integer UPDATED_STATUS = 2;

    private static final String DEFAULT_USER_CARID = "AAAAAAAAAA";
    private static final String UPDATED_USER_CARID = "BBBBBBBBBB";

    private static final String DEFAULT_HEADICON = "AAAAAAAAAA";
    private static final String UPDATED_HEADICON = "BBBBBBBBBB";

    private static final String DEFAULT_POSITIONS = "AAAAAAAAAA";
    private static final String UPDATED_POSITIONS = "BBBBBBBBBB";

    private static final String DEFAULT_DEPARTMENTAUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_DEPARTMENTAUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_USER_SEX = "AAAAAAAAAA";
    private static final String UPDATED_USER_SEX = "BBBBBBBBBB";

    private static final String DEFAULT_LEJIA_NUM = "AAAAAAAAAA";
    private static final String UPDATED_LEJIA_NUM = "BBBBBBBBBB";

    private static final Integer DEFAULT_HASUPDATED = 1;
    private static final Integer UPDATED_HASUPDATED = 2;

    private static final Integer DEFAULT_USER_SORT = 1;
    private static final Integer UPDATED_USER_SORT = 2;

    @Autowired
    private SysUserRepository sysUserRepository;
    @Autowired
    private SysRoleRepository sysRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSysUserMockMvc;

    private SysUser sysUser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SysUserResource sysUserResource = new SysUserResource(sysUserRepository,sysRoleRepository,passwordEncoder);
        this.restSysUserMockMvc = MockMvcBuilders.standaloneSetup(sysUserResource)
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
    public static SysUser createEntity(EntityManager em) {
        SysUser sysUser = new SysUser()
            .companyId(DEFAULT_COMPANY_ID)
            .userName(DEFAULT_USER_NAME)
            .userPwd(DEFAULT_USER_PWD)
            .userDesc(DEFAULT_USER_DESC)
            .lastlogindate(DEFAULT_LASTLOGINDATE)
            .createdby(DEFAULT_CREATEDBY)
            .createdon(DEFAULT_CREATEDON)
            .modifedby(DEFAULT_MODIFEDBY)
            .modifedon(DEFAULT_MODIFEDON)
            .modifiedby(DEFAULT_MODIFIEDBY)
            .modifiedon(DEFAULT_MODIFIEDON)
            .userphone(DEFAULT_USERPHONE)
            .email(DEFAULT_EMAIL)
            .lastlogingroup(DEFAULT_LASTLOGINGROUP)
            .groupid(DEFAULT_GROUPID)
            .realname(DEFAULT_REALNAME)
            .status(DEFAULT_STATUS)
            .userCarid(DEFAULT_USER_CARID)
            .headicon(DEFAULT_HEADICON)
            .positions(DEFAULT_POSITIONS)
            .departmentauthor(DEFAULT_DEPARTMENTAUTHOR)
            .userSex(DEFAULT_USER_SEX)
            .lejiaNum(DEFAULT_LEJIA_NUM)
            .hasupdated(DEFAULT_HASUPDATED)
            .userSort(DEFAULT_USER_SORT);
        return sysUser;
    }

    @Before
    public void initTest() {
        sysUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createSysUser() throws Exception {
        int databaseSizeBeforeCreate = sysUserRepository.findAll().size();

        // Create the SysUser
        restSysUserMockMvc.perform(post("/api/sys-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysUser)))
            .andExpect(status().isCreated());

        // Validate the SysUser in the database
        List<SysUser> sysUserList = sysUserRepository.findAll();
        assertThat(sysUserList).hasSize(databaseSizeBeforeCreate + 1);
        SysUser testSysUser = sysUserList.get(sysUserList.size() - 1);
        assertThat(testSysUser.getCompanyId()).isEqualTo(DEFAULT_COMPANY_ID);
        assertThat(testSysUser.getUserName()).isEqualTo(DEFAULT_USER_NAME);
        assertThat(testSysUser.getUserPwd()).isEqualTo(DEFAULT_USER_PWD);
        assertThat(testSysUser.getUserDesc()).isEqualTo(DEFAULT_USER_DESC);
        assertThat(testSysUser.getLastlogindate()).isEqualTo(DEFAULT_LASTLOGINDATE);
        assertThat(testSysUser.getCreatedby()).isEqualTo(DEFAULT_CREATEDBY);
        assertThat(testSysUser.getCreatedon()).isEqualTo(DEFAULT_CREATEDON);
        assertThat(testSysUser.getModifedby()).isEqualTo(DEFAULT_MODIFEDBY);
        assertThat(testSysUser.getModifedon()).isEqualTo(DEFAULT_MODIFEDON);
        assertThat(testSysUser.getModifiedby()).isEqualTo(DEFAULT_MODIFIEDBY);
        assertThat(testSysUser.getModifiedon()).isEqualTo(DEFAULT_MODIFIEDON);
        assertThat(testSysUser.getUserphone()).isEqualTo(DEFAULT_USERPHONE);
        assertThat(testSysUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSysUser.getLastlogingroup()).isEqualTo(DEFAULT_LASTLOGINGROUP);
        assertThat(testSysUser.getGroupid()).isEqualTo(DEFAULT_GROUPID);
        assertThat(testSysUser.getRealname()).isEqualTo(DEFAULT_REALNAME);
        assertThat(testSysUser.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSysUser.getUserCarid()).isEqualTo(DEFAULT_USER_CARID);
        assertThat(testSysUser.getHeadicon()).isEqualTo(DEFAULT_HEADICON);
        assertThat(testSysUser.getPositions()).isEqualTo(DEFAULT_POSITIONS);
        assertThat(testSysUser.getDepartmentauthor()).isEqualTo(DEFAULT_DEPARTMENTAUTHOR);
        assertThat(testSysUser.getUserSex()).isEqualTo(DEFAULT_USER_SEX);
        assertThat(testSysUser.getLejiaNum()).isEqualTo(DEFAULT_LEJIA_NUM);
        assertThat(testSysUser.getHasupdated()).isEqualTo(DEFAULT_HASUPDATED);
        assertThat(testSysUser.getUserSort()).isEqualTo(DEFAULT_USER_SORT);
    }

    @Test
    @Transactional
    public void createSysUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sysUserRepository.findAll().size();

        // Create the SysUser with an existing ID
        sysUser.setId("111");

        // An entity with an existing ID cannot be created, so this API call must fail
        restSysUserMockMvc.perform(post("/api/sys-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysUser)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<SysUser> sysUserList = sysUserRepository.findAll();
        assertThat(sysUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSysUsers() throws Exception {
        // Initialize the database
        sysUserRepository.saveAndFlush(sysUser);

        // Get all the sysUserList
        restSysUserMockMvc.perform(get("/api/sys-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sysUser.getId().toString())))
            .andExpect(jsonPath("$.[*].companyId").value(hasItem(DEFAULT_COMPANY_ID.toString())))
            .andExpect(jsonPath("$.[*].userName").value(hasItem(DEFAULT_USER_NAME.toString())))
            .andExpect(jsonPath("$.[*].userPwd").value(hasItem(DEFAULT_USER_PWD.toString())))
            .andExpect(jsonPath("$.[*].userDesc").value(hasItem(DEFAULT_USER_DESC.toString())))
            .andExpect(jsonPath("$.[*].lastlogindate").value(hasItem(DEFAULT_LASTLOGINDATE.toString())))
            .andExpect(jsonPath("$.[*].createdby").value(hasItem(DEFAULT_CREATEDBY.toString())))
            .andExpect(jsonPath("$.[*].createdon").value(hasItem(DEFAULT_CREATEDON.toString())))
            .andExpect(jsonPath("$.[*].modifedby").value(hasItem(DEFAULT_MODIFEDBY.toString())))
            .andExpect(jsonPath("$.[*].modifedon").value(hasItem(DEFAULT_MODIFEDON.toString())))
            .andExpect(jsonPath("$.[*].modifiedby").value(hasItem(DEFAULT_MODIFIEDBY.toString())))
            .andExpect(jsonPath("$.[*].modifiedon").value(hasItem(DEFAULT_MODIFIEDON.toString())))
            .andExpect(jsonPath("$.[*].userphone").value(hasItem(DEFAULT_USERPHONE.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].lastlogingroup").value(hasItem(DEFAULT_LASTLOGINGROUP.toString())))
            .andExpect(jsonPath("$.[*].groupid").value(hasItem(DEFAULT_GROUPID.toString())))
            .andExpect(jsonPath("$.[*].realname").value(hasItem(DEFAULT_REALNAME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.intValue())))
            .andExpect(jsonPath("$.[*].userCarid").value(hasItem(DEFAULT_USER_CARID.toString())))
            .andExpect(jsonPath("$.[*].headicon").value(hasItem(DEFAULT_HEADICON.toString())))
            .andExpect(jsonPath("$.[*].positions").value(hasItem(DEFAULT_POSITIONS.toString())))
            .andExpect(jsonPath("$.[*].departmentauthor").value(hasItem(DEFAULT_DEPARTMENTAUTHOR.toString())))
            .andExpect(jsonPath("$.[*].userSex").value(hasItem(DEFAULT_USER_SEX.toString())))
            .andExpect(jsonPath("$.[*].lejiaNum").value(hasItem(DEFAULT_LEJIA_NUM.toString())))
            .andExpect(jsonPath("$.[*].hasupdated").value(hasItem(DEFAULT_HASUPDATED.intValue())))
            .andExpect(jsonPath("$.[*].userSort").value(hasItem(DEFAULT_USER_SORT.intValue())));
    }

    @Test
    @Transactional
    public void getSysUser() throws Exception {
        // Initialize the database
        sysUserRepository.saveAndFlush(sysUser);

        // Get the sysUser
        restSysUserMockMvc.perform(get("/api/sys-users/{id}", sysUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sysUser.getId().toString()))
            .andExpect(jsonPath("$.companyId").value(DEFAULT_COMPANY_ID.toString()))
            .andExpect(jsonPath("$.userName").value(DEFAULT_USER_NAME.toString()))
            .andExpect(jsonPath("$.userPwd").value(DEFAULT_USER_PWD.toString()))
            .andExpect(jsonPath("$.userDesc").value(DEFAULT_USER_DESC.toString()))
            .andExpect(jsonPath("$.lastlogindate").value(DEFAULT_LASTLOGINDATE.toString()))
            .andExpect(jsonPath("$.createdby").value(DEFAULT_CREATEDBY.toString()))
            .andExpect(jsonPath("$.createdon").value(DEFAULT_CREATEDON.toString()))
            .andExpect(jsonPath("$.modifedby").value(DEFAULT_MODIFEDBY.toString()))
            .andExpect(jsonPath("$.modifedon").value(DEFAULT_MODIFEDON.toString()))
            .andExpect(jsonPath("$.modifiedby").value(DEFAULT_MODIFIEDBY.toString()))
            .andExpect(jsonPath("$.modifiedon").value(DEFAULT_MODIFIEDON.toString()))
            .andExpect(jsonPath("$.userphone").value(DEFAULT_USERPHONE.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.lastlogingroup").value(DEFAULT_LASTLOGINGROUP.toString()))
            .andExpect(jsonPath("$.groupid").value(DEFAULT_GROUPID.toString()))
            .andExpect(jsonPath("$.realname").value(DEFAULT_REALNAME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.intValue()))
            .andExpect(jsonPath("$.userCarid").value(DEFAULT_USER_CARID.toString()))
            .andExpect(jsonPath("$.headicon").value(DEFAULT_HEADICON.toString()))
            .andExpect(jsonPath("$.positions").value(DEFAULT_POSITIONS.toString()))
            .andExpect(jsonPath("$.departmentauthor").value(DEFAULT_DEPARTMENTAUTHOR.toString()))
            .andExpect(jsonPath("$.userSex").value(DEFAULT_USER_SEX.toString()))
            .andExpect(jsonPath("$.lejiaNum").value(DEFAULT_LEJIA_NUM.toString()))
            .andExpect(jsonPath("$.hasupdated").value(DEFAULT_HASUPDATED.intValue()))
            .andExpect(jsonPath("$.userSort").value(DEFAULT_USER_SORT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSysUser() throws Exception {
        // Get the sysUser
        restSysUserMockMvc.perform(get("/api/sys-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSysUser() throws Exception {
        // Initialize the database
        sysUserRepository.saveAndFlush(sysUser);
        int databaseSizeBeforeUpdate = sysUserRepository.findAll().size();

        // Update the sysUser
        SysUser updatedSysUser = sysUserRepository.findById(sysUser.getId());
        updatedSysUser
            .companyId(UPDATED_COMPANY_ID)
            .userName(UPDATED_USER_NAME)
            .userPwd(UPDATED_USER_PWD)
            .userDesc(UPDATED_USER_DESC)
            .lastlogindate(UPDATED_LASTLOGINDATE)
            .createdby(UPDATED_CREATEDBY)
            .createdon(UPDATED_CREATEDON)
            .modifedby(UPDATED_MODIFEDBY)
            .modifedon(UPDATED_MODIFEDON)
            .modifiedby(UPDATED_MODIFIEDBY)
            .modifiedon(UPDATED_MODIFIEDON)
            .userphone(UPDATED_USERPHONE)
            .email(UPDATED_EMAIL)
            .lastlogingroup(UPDATED_LASTLOGINGROUP)
            .groupid(UPDATED_GROUPID)
            .realname(UPDATED_REALNAME)
            .status(UPDATED_STATUS)
            .userCarid(UPDATED_USER_CARID)
            .headicon(UPDATED_HEADICON)
            .positions(UPDATED_POSITIONS)
            .departmentauthor(UPDATED_DEPARTMENTAUTHOR)
            .userSex(UPDATED_USER_SEX)
            .lejiaNum(UPDATED_LEJIA_NUM)
            .hasupdated(UPDATED_HASUPDATED)
            .userSort(UPDATED_USER_SORT);

        restSysUserMockMvc.perform(put("/api/sys-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSysUser)))
            .andExpect(status().isOk());

        // Validate the SysUser in the database
        List<SysUser> sysUserList = sysUserRepository.findAll();
        assertThat(sysUserList).hasSize(databaseSizeBeforeUpdate);
        SysUser testSysUser = sysUserList.get(sysUserList.size() - 1);
        assertThat(testSysUser.getCompanyId()).isEqualTo(UPDATED_COMPANY_ID);
        assertThat(testSysUser.getUserName()).isEqualTo(UPDATED_USER_NAME);
        assertThat(testSysUser.getUserPwd()).isEqualTo(UPDATED_USER_PWD);
        assertThat(testSysUser.getUserDesc()).isEqualTo(UPDATED_USER_DESC);
        assertThat(testSysUser.getLastlogindate()).isEqualTo(UPDATED_LASTLOGINDATE);
        assertThat(testSysUser.getCreatedby()).isEqualTo(UPDATED_CREATEDBY);
        assertThat(testSysUser.getCreatedon()).isEqualTo(UPDATED_CREATEDON);
        assertThat(testSysUser.getModifedby()).isEqualTo(UPDATED_MODIFEDBY);
        assertThat(testSysUser.getModifedon()).isEqualTo(UPDATED_MODIFEDON);
        assertThat(testSysUser.getModifiedby()).isEqualTo(UPDATED_MODIFIEDBY);
        assertThat(testSysUser.getModifiedon()).isEqualTo(UPDATED_MODIFIEDON);
        assertThat(testSysUser.getUserphone()).isEqualTo(UPDATED_USERPHONE);
        assertThat(testSysUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSysUser.getLastlogingroup()).isEqualTo(UPDATED_LASTLOGINGROUP);
        assertThat(testSysUser.getGroupid()).isEqualTo(UPDATED_GROUPID);
        assertThat(testSysUser.getRealname()).isEqualTo(UPDATED_REALNAME);
        assertThat(testSysUser.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSysUser.getUserCarid()).isEqualTo(UPDATED_USER_CARID);
        assertThat(testSysUser.getHeadicon()).isEqualTo(UPDATED_HEADICON);
        assertThat(testSysUser.getPositions()).isEqualTo(UPDATED_POSITIONS);
        assertThat(testSysUser.getDepartmentauthor()).isEqualTo(UPDATED_DEPARTMENTAUTHOR);
        assertThat(testSysUser.getUserSex()).isEqualTo(UPDATED_USER_SEX);
        assertThat(testSysUser.getLejiaNum()).isEqualTo(UPDATED_LEJIA_NUM);
        assertThat(testSysUser.getHasupdated()).isEqualTo(UPDATED_HASUPDATED);
        assertThat(testSysUser.getUserSort()).isEqualTo(UPDATED_USER_SORT);
    }

    @Test
    @Transactional
    public void updateNonExistingSysUser() throws Exception {
        int databaseSizeBeforeUpdate = sysUserRepository.findAll().size();

        // Create the SysUser

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSysUserMockMvc.perform(put("/api/sys-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sysUser)))
            .andExpect(status().isCreated());

        // Validate the SysUser in the database
        List<SysUser> sysUserList = sysUserRepository.findAll();
        assertThat(sysUserList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSysUser() throws Exception {
        // Initialize the database
        sysUserRepository.saveAndFlush(sysUser);
        int databaseSizeBeforeDelete = sysUserRepository.findAll().size();

        // Get the sysUser
        restSysUserMockMvc.perform(delete("/api/sys-users/{id}", sysUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SysUser> sysUserList = sysUserRepository.findAll();
        assertThat(sysUserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SysUser.class);
        SysUser sysUser1 = new SysUser();
        sysUser1.setId("111");
        SysUser sysUser2 = new SysUser();
        sysUser2.setId(sysUser1.getId());
        assertThat(sysUser1).isEqualTo(sysUser2);
        sysUser2.setId("222");
        assertThat(sysUser1).isNotEqualTo(sysUser2);
        sysUser1.setId(null);
        assertThat(sysUser1).isNotEqualTo(sysUser2);
    }
}
