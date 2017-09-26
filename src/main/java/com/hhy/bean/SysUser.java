package com.hhy.bean;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Table(name = "sys_user")
public class SysUser extends BaseBean{

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(name = "username")
	private String userName;

	@Column(name = "password")
	private String passWord;
	
	/*CascadeType.PERSIST级联新增（又称级联保存）； 
	CascadeType.MERGE:级联合并（级联更新）； 
	CascadeType.REMOVE:级联删除； 
	CascadeType.REFRESH:级联刷新 
	CascadeType.ALL:以上四种都是；*/ 
	@ManyToOne(optional = false,cascade = CascadeType.ALL/*,fetch=FetchType.EAGER*/)
    private SysPerson person;// 用户表外键

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable( name = "sys_user_role",joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
            @JoinColumn(name = "role_id") }) //被控方表字段名
	private Set<SysRole> roleSet;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassWord() {
		return passWord;
	}

	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}

	public SysPerson getPerson() {
		return person;
	}
	
	@JsonBackReference
	public void setPerson(SysPerson person) {
		this.person = person;
	}

	public Set<SysRole> getRoleSet() {
		return roleSet;
	}

	public void setRoleSet(Set<SysRole> roleSet) {
		this.roleSet = roleSet;
	}

}