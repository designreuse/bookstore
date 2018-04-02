package com.jshx.lbs.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

/**
 * The t_sys_privilege entity.
 */
@ApiModel(description = "The t_sys_privilege entity.")
@Entity
@Table(name = "t_sys_privilege")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SysPrivilege implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name = "privilege_id")
    private String id;

    @Size(max = 40)
    @Column(name = "privilege_pid", length = 40)
    private String privilegePid;

    @Size(max = 200)
    @Column(name = "privilege_name", length = 200)
    private String privilegeName;

    @Size(max = 40)
    @Column(name = "companyid", length = 40)
    private String companyid;

    @Size(max = 200)
    @Column(name = "privilige_desc", length = 200)
    private String priviligeDesc;

    @Column(name = "isflag")
    private Integer isflag;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPrivilegePid() {
        return privilegePid;
    }

    public SysPrivilege privilegePid(String privilegePid) {
        this.privilegePid = privilegePid;
        return this;
    }

    public void setPrivilegePid(String privilegePid) {
        this.privilegePid = privilegePid;
    }

    public String getPrivilegeName() {
        return privilegeName;
    }

    public SysPrivilege privilegeName(String privilegeName) {
        this.privilegeName = privilegeName;
        return this;
    }

    public void setPrivilegeName(String privilegeName) {
        this.privilegeName = privilegeName;
    }

    public String getCompanyid() {
        return companyid;
    }

    public SysPrivilege companyid(String companyid) {
        this.companyid = companyid;
        return this;
    }

    public void setCompanyid(String companyid) {
        this.companyid = companyid;
    }

    public String getPriviligeDesc() {
        return priviligeDesc;
    }

    public SysPrivilege priviligeDesc(String priviligeDesc) {
        this.priviligeDesc = priviligeDesc;
        return this;
    }

    public void setPriviligeDesc(String priviligeDesc) {
        this.priviligeDesc = priviligeDesc;
    }

    public Integer getIsflag() {
        return isflag;
    }

    public SysPrivilege isflag(Integer isflag) {
        this.isflag = isflag;
        return this;
    }

    public void setIsflag(Integer isflag) {
        this.isflag = isflag;
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
        SysPrivilege sysPrivilege = (SysPrivilege) o;
        if (sysPrivilege.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sysPrivilege.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SysPrivilege{" +
            "id=" + getId() +
            ", privilegePid='" + getPrivilegePid() + "'" +
            ", privilegeName='" + getPrivilegeName() + "'" +
            ", companyid='" + getCompanyid() + "'" +
            ", priviligeDesc='" + getPriviligeDesc() + "'" +
            ", isflag='" + getIsflag() + "'" +
            "}";
    }
}
