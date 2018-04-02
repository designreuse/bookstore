package com.jshx.lbs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * The t_sys_user entity.
 */
@ApiModel(description = "The t_sys_user entity.")
@Entity
@Table(name = "t_sys_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@NamedEntityGraph(name = "sysUser.all",
                  attributeNodes = @NamedAttributeNode(value = "sysRoles", subgraph = "sysRoles"),
                  subgraphs = @NamedSubgraph(name = "sysRoles", attributeNodes = @NamedAttributeNode("sysPrivileges")))
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name = "user_id")
    private String id;

    @Size(max = 40)
    @Column(name = "company_id", length = 40)
    private String companyId;

    @Size(max = 100)
    @Column(name = "user_name", length = 100)
    private String userName;

    @Size(max = 100)
    @Column(name = "user_pwd", length = 100)
    private String userPwd;

    @Size(max = 200)
    @Column(name = "user_desc", length = 200)
    private String userDesc;

    @Column(name = "lastlogindate")
    private LocalDate lastlogindate;

    @Size(max = 40)
    @Column(name = "createdby", length = 40)
    private String createdby;

    @Column(name = "createdon")
    private LocalDate createdon;

    @Size(max = 40)
    @Column(name = "modifedby", length = 40)
    private String modifedby;

    @Column(name = "modifedon")
    private LocalDate modifedon;

    @Size(max = 40)
    @Column(name = "modifiedby", length = 40)
    private String modifiedby;

    @Column(name = "modifiedon")
    private LocalDate modifiedon;

    @Size(max = 40)
    @Column(name = "userphone", length = 40)
    private String userphone;

    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @Size(max = 50)
    @Column(name = "lastlogingroup", length = 50)
    private String lastlogingroup;

    @Size(max = 40)
    @Column(name = "groupid", length = 40)
    private String groupid;

    @Size(max = 150)
    @Column(name = "realname", length = 150)
    private String realname;

    @Column(name = "status", precision=10, scale=2)
    private Integer status;

    @Size(max = 40)
    @Column(name = "user_carid", length = 40)
    private String userCarid;

    @Size(max = 200)
    @Column(name = "headicon", length = 200)
    private String headicon;

    @Size(max = 10)
    @Column(name = "positions", length = 10)
    private String positions;

    @Size(max = 10)
    @Column(name = "departmentauthor", length = 10)
    private String departmentauthor;

    @Size(max = 10)
    @Column(name = "user_sex", length = 10)
    private String userSex;

    @Size(max = 100)
    @Column(name = "lejia_num", length = 100)
    private String lejiaNum;

    @Column(name = "hasupdated", precision=10, scale=2)
    private Integer hasupdated;

    @Column(name = "user_sort", precision=10, scale=2)
    private Integer userSort;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "T_SYS_USERROLE",
        joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "user_id")},
        inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "role_id")})
//    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @BatchSize(size = 20)
    private Set<SysRole> sysRoles = new HashSet<>();

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCompanyId() {
        return companyId;
    }

    public SysUser companyId(String companyId) {
        this.companyId = companyId;
        return this;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getUserName() {
        return userName;
    }

    public SysUser userName(String userName) {
        this.userName = userName;
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPwd() {
        return userPwd;
    }

    public SysUser userPwd(String userPwd) {
        this.userPwd = userPwd;
        return this;
    }

    public void setUserPwd(String userPwd) {
        this.userPwd = userPwd;
    }

    public String getUserDesc() {
        return userDesc;
    }

    public SysUser userDesc(String userDesc) {
        this.userDesc = userDesc;
        return this;
    }

    public void setUserDesc(String userDesc) {
        this.userDesc = userDesc;
    }

    public LocalDate getLastlogindate() {
        return lastlogindate;
    }

    public SysUser lastlogindate(LocalDate lastlogindate) {
        this.lastlogindate = lastlogindate;
        return this;
    }

    public void setLastlogindate(LocalDate lastlogindate) {
        this.lastlogindate = lastlogindate;
    }

    public String getCreatedby() {
        return createdby;
    }

    public SysUser createdby(String createdby) {
        this.createdby = createdby;
        return this;
    }

    public void setCreatedby(String createdby) {
        this.createdby = createdby;
    }

    public LocalDate getCreatedon() {
        return createdon;
    }

    public SysUser createdon(LocalDate createdon) {
        this.createdon = createdon;
        return this;
    }

    public void setCreatedon(LocalDate createdon) {
        this.createdon = createdon;
    }

    public String getModifedby() {
        return modifedby;
    }

    public SysUser modifedby(String modifedby) {
        this.modifedby = modifedby;
        return this;
    }

    public void setModifedby(String modifedby) {
        this.modifedby = modifedby;
    }

    public LocalDate getModifedon() {
        return modifedon;
    }

    public SysUser modifedon(LocalDate modifedon) {
        this.modifedon = modifedon;
        return this;
    }

    public void setModifedon(LocalDate modifedon) {
        this.modifedon = modifedon;
    }

    public String getModifiedby() {
        return modifiedby;
    }

    public SysUser modifiedby(String modifiedby) {
        this.modifiedby = modifiedby;
        return this;
    }

    public void setModifiedby(String modifiedby) {
        this.modifiedby = modifiedby;
    }

    public LocalDate getModifiedon() {
        return modifiedon;
    }

    public SysUser modifiedon(LocalDate modifiedon) {
        this.modifiedon = modifiedon;
        return this;
    }

    public void setModifiedon(LocalDate modifiedon) {
        this.modifiedon = modifiedon;
    }

    public String getUserphone() {
        return userphone;
    }

    public SysUser userphone(String userphone) {
        this.userphone = userphone;
        return this;
    }

    public void setUserphone(String userphone) {
        this.userphone = userphone;
    }

    public String getEmail() {
        return email;
    }

    public SysUser email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastlogingroup() {
        return lastlogingroup;
    }

    public SysUser lastlogingroup(String lastlogingroup) {
        this.lastlogingroup = lastlogingroup;
        return this;
    }

    public void setLastlogingroup(String lastlogingroup) {
        this.lastlogingroup = lastlogingroup;
    }

    public String getGroupid() {
        return groupid;
    }

    public SysUser groupid(String groupid) {
        this.groupid = groupid;
        return this;
    }

    public void setGroupid(String groupid) {
        this.groupid = groupid;
    }

    public String getRealname() {
        return realname;
    }

    public SysUser realname(String realname) {
        this.realname = realname;
        return this;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }

    public Integer getStatus() {
        return status;
    }

    public SysUser status(Integer status) {
        this.status = status;
        return this;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getUserCarid() {
        return userCarid;
    }

    public SysUser userCarid(String userCarid) {
        this.userCarid = userCarid;
        return this;
    }

    public void setUserCarid(String userCarid) {
        this.userCarid = userCarid;
    }

    public String getHeadicon() {
        return headicon;
    }

    public SysUser headicon(String headicon) {
        this.headicon = headicon;
        return this;
    }

    public void setHeadicon(String headicon) {
        this.headicon = headicon;
    }

    public String getPositions() {
        return positions;
    }

    public SysUser positions(String positions) {
        this.positions = positions;
        return this;
    }

    public void setPositions(String positions) {
        this.positions = positions;
    }

    public String getDepartmentauthor() {
        return departmentauthor;
    }

    public SysUser departmentauthor(String departmentauthor) {
        this.departmentauthor = departmentauthor;
        return this;
    }

    public void setDepartmentauthor(String departmentauthor) {
        this.departmentauthor = departmentauthor;
    }

    public String getUserSex() {
        return userSex;
    }

    public SysUser userSex(String userSex) {
        this.userSex = userSex;
        return this;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex;
    }

    public String getLejiaNum() {
        return lejiaNum;
    }

    public SysUser lejiaNum(String lejiaNum) {
        this.lejiaNum = lejiaNum;
        return this;
    }

    public void setLejiaNum(String lejiaNum) {
        this.lejiaNum = lejiaNum;
    }

    public Integer getHasupdated() {
        return hasupdated;
    }

    public SysUser hasupdated(Integer hasupdated) {
        this.hasupdated = hasupdated;
        return this;
    }

    public void setHasupdated(Integer hasupdated) {
        this.hasupdated = hasupdated;
    }

    public Integer getUserSort() {
        return userSort;
    }

    public SysUser userSort(Integer userSort) {
        this.userSort = userSort;
        return this;
    }

    public void setUserSort(Integer userSort) {
        this.userSort = userSort;
    }

    public Set<SysRole> getSysRoles() {
        return sysRoles;
    }

    public void setSysRoles(Set<SysRole> sysRoles) {
        this.sysRoles = sysRoles;
    }
// jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SysUser sysUser = (SysUser) o;
        if (sysUser.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sysUser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SysUser{" +
            "id=" + getId() +
            ", companyId='" + getCompanyId() + "'" +
            ", userName='" + getUserName() + "'" +
            ", userPwd='" + getUserPwd() + "'" +
            ", userDesc='" + getUserDesc() + "'" +
            ", lastlogindate='" + getLastlogindate() + "'" +
            ", createdby='" + getCreatedby() + "'" +
            ", createdon='" + getCreatedon() + "'" +
            ", modifedby='" + getModifedby() + "'" +
            ", modifedon='" + getModifedon() + "'" +
            ", modifiedby='" + getModifiedby() + "'" +
            ", modifiedon='" + getModifiedon() + "'" +
            ", userphone='" + getUserphone() + "'" +
            ", email='" + getEmail() + "'" +
            ", lastlogingroup='" + getLastlogingroup() + "'" +
            ", groupid='" + getGroupid() + "'" +
            ", realname='" + getRealname() + "'" +
            ", status='" + getStatus() + "'" +
            ", userCarid='" + getUserCarid() + "'" +
            ", headicon='" + getHeadicon() + "'" +
            ", positions='" + getPositions() + "'" +
            ", departmentauthor='" + getDepartmentauthor() + "'" +
            ", userSex='" + getUserSex() + "'" +
            ", lejiaNum='" + getLejiaNum() + "'" +
            ", hasupdated='" + getHasupdated() + "'" +
            ", userSort='" + getUserSort() + "'" +
            "}";
    }
}
