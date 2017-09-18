package com.hhy.bean;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "sys_role")
public class SysRole {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@Column(name = "name")
	private String name;
	
	@ManyToMany(mappedBy = "roleSet")//mapperdBy 防止两边重复建表
	private Set<SysUser> userSet;
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
	public Set<SysUser> getUserSet() {
		return userSet;
	}
	@JsonBackReference
	public void setUserSet(Set<SysUser> userSet) {
		this.userSet = userSet;
	}
	
	

}
