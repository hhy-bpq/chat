package com.hhy.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hhy.bean.SysUser;

public interface SysUserDao extends JpaRepository<SysUser, Long> {
	
	public SysUser findByUserName(String name);


}