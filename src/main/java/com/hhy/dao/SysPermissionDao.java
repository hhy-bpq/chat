package com.hhy.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hhy.bean.SysPermission;
import com.hhy.bean.SysPerson;

/**
 * 
 * @author huanghaiyun
 * @createTime 2017年9月26日
 *
 */
public interface SysPermissionDao extends JpaRepository<SysPermission, Long> {

	/**
	 * 根据用户名获取权限列表
	 * @param username  用户名
	 * @return
	 */
	List<SysPermission> findByRoleSetUserSetUserName(String username);
}