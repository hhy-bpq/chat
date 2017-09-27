package com.hhy.bean;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.alibaba.fastjson.annotation.JSONField;

@Entity
@Table(name = "sys_role")
public class SysRole {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@Column(name = "name")
	private String name;

    //父节点id
	@Column
    private Integer pid;
	
	@JSONField(serialize=false)  
	@ManyToMany(mappedBy = "roleSet")//mapperdBy 防止两边重复建表
	private Set<SysUser> userSet;
	
	
	@JSONField(serialize=false)  
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable( name = "sys_role_permission",joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = {
            @JoinColumn(name = "perm_id") }) //被控方表字段名
	private Set<SysPermission> permSet;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public Integer getPid() {
		return pid;
	}
	public void setPid(Integer pid) {
		this.pid = pid;
	}
	public Set<SysUser> getUserSet() {
		return userSet;
	}
	
	public void setUserSet(Set<SysUser> userSet) {
		this.userSet = userSet;
	}
	public Set<SysPermission> getPermSet() {
		return permSet;
	}
	public void setPermSet(Set<SysPermission> permSet) {
		this.permSet = permSet;
	}
}
