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

	@Column(name = "account")
	private String account;

	@Column(name = "password")
	private String passWord;
	
	/*CascadeType.PERSIST级联新增（又称级联保存）； 
	CascadeType.MERGE:级联合并（级联更新）； 
	CascadeType.REMOVE:级联删除； 
	CascadeType.REFRESH:级联刷新 
	CascadeType.ALL:以上四种都是；*/ 
	@ManyToOne(optional = false,cascade = CascadeType.ALL)
    private SysPerson person;// 用户表外键

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable( name = "sys_user_role",joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = {
            @JoinColumn(name = "user_id") }) //被控方表字段名
	private Set<SysRole> roleSet;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
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