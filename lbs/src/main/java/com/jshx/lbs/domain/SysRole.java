package com.jshx.lbs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A SysRole.
 */
@Entity
@Table(name = "t_sys_role")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SysRole implements Serializable {

    private static final long serialVersionUID = 1L;

//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
//    @SequenceGenerator(name = "sequenceGenerator")
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name = "role_id")
    private String id;

    @Column(name = "role_name")
    private String roleName;

    @Column(name = "role_pid")
    private String rolePid;

    @Column(name = "comapany_id")
    private String companyId;

    @Column(name = "role_desc")
    private String roleDesc;

    @Column(name = "issys")
    private Integer issys;

    @Column(name = "role_code")
    private String roleCode;

    @Column(name = "role_deep")
    private Integer roleDeep;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "t_sys_roleprivilege",
        joinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "role_id")},
        inverseJoinColumns = {@JoinColumn(name = "privilege_id", referencedColumnName = "privilege_id")})
//    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @BatchSize(size = 20)
    private Set<SysPrivilege> sysPrivileges = new HashSet<>();


    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public SysRole roleName(String roleName) {
        this.roleName = roleName;
        return this;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRolePid() {
        return rolePid;
    }

    public SysRole rolePid(String rolePid) {
        this.rolePid = rolePid;
        return this;
    }

    public void setRolePid(String rolePid) {
        this.rolePid = rolePid;
    }

    public String getCompanyId() {
        return companyId;
    }

    public SysRole companyId(String companyId) {
        this.companyId = companyId;
        return this;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getRoleDesc() {
        return roleDesc;
    }

    public SysRole roleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
        return this;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
    }

    public Integer getIssys() {
        return issys;
    }

    public SysRole issys(Integer issys) {
        this.issys = issys;
        return this;
    }

    public void setIssys(Integer issys) {
        this.issys = issys;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public SysRole roleCode(String roleCode) {
        this.roleCode = roleCode;
        return this;
    }

    public Integer getRoleDeep() {
        return roleDeep;
    }

    public void setRoleDeep(Integer roleDeep) {
        this.roleDeep = roleDeep;
    }

    public SysRole roleDeep(Integer roleDeep) {
        this.roleDeep = roleDeep;
        return this;
    }

    public Set<SysPrivilege> getSysPrivileges() {
        return sysPrivileges;
    }

    public void setSysPrivileges(Set<SysPrivilege> sysPrivileges) {
        this.sysPrivileges = sysPrivileges;
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
        SysRole sysRole = (SysRole) o;
        if (sysRole.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sysRole.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SysRole{" +
            "id=" + getId() +
            ", roleName='" + getRoleName() + "'" +
            ", rolePid='" + getRolePid() + "'" +
            ", companyId='" + getCompanyId() + "'" +
            ", roleDesc='" + getRoleDesc() + "'" +
            ", issys='" + getIssys() + "'" +
            ", roleCode='" + getRoleCode() + "'" +
            ", roleDeep='" + getRoleDeep() + "'" +
            "}";
    }
}
