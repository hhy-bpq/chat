package com.hhy.bean;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * 具体权限节点
 * @author huanghaiyun
 * @createTime 2017年9月26日
 *
 */

@Entity
@Table(name = "sys_permission")
public class SysPermission extends BaseBean {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
    private int id;
    //权限名称
	@Column
    private String name;

    //权限描述
	@Column
	private String descritpion;

    //授权链接
	@Column
    private String url;

	
	@JSONField(serialize=false)  
	@ManyToMany(mappedBy = "permSet")//mapperdBy 防止两边重复建表
	private Set<SysRole> roleSet;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescritpion() {
        return descritpion;
    }

    public void setDescritpion(String descritpion) {
        this.descritpion = descritpion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

	public Set<SysRole> getRoleSet() {
		return roleSet;
	}

	public void setRoleSet(Set<SysRole> roleSet) {
		this.roleSet = roleSet;
	}
    
}