package com.hhy.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hhy.bean.SysUser;

public interface SysUserDao extends JpaRepository<SysUser, Long> {
	
	


}