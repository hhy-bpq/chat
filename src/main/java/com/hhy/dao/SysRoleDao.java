package com.hhy.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hhy.bean.SysRole;

public interface SysRoleDao extends JpaRepository<SysRole, Long> {
	
	/**
	 * 根据权限名称 查找拥有该权限的 角色
	 * @param name
	 * @return
	 */
	List<SysRole> findByPermSetName(String name);

}