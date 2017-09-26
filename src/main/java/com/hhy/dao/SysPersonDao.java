package com.hhy.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hhy.bean.SysPerson;

public interface SysPersonDao extends JpaRepository<SysPerson, Long> {

	/**
	 * 根据用户名获取用户
	 * @param name
	 * @return
	 */
	SysPerson findPersonByName(String name);
	/**
	 * 根据账户名 获取用户
	 * @param name
	 * @return
	 */
	SysPerson findPersonByUserSetUserName(String name);
}