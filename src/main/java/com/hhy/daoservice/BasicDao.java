package com.hhy.daoservice;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hhy.bean.User;

public interface BasicDao extends CrudRepository<User, Integer> {

    @Query("from User ")
    List<User> getList();

}