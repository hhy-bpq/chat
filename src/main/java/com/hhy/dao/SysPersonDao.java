package com.hhy.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hhy.bean.SysPerson;

public interface SysPersonDao extends JpaRepository<SysPerson, Long> {

	List<SysPerson> findPersonByName(String name);
}