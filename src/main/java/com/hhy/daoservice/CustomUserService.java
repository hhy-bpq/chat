package com.hhy.daoservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hhy.bean.SysRole;
import com.hhy.bean.SysUser;
import com.hhy.dao.SysUserDao;
import com.hhy.service.WebSocketService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangyibo on 17/1/18.
 */
@Service
public class CustomUserService implements UserDetailsService { //自定义UserDetailsService 接口

	private static final Logger LOG =  LoggerFactory.getLogger(CustomUserService.class);

    @Autowired
    SysUserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) { //重写loadUserByUsername 方法获得 userdetails 类型用户

        SysUser user = userDao.findByAccount(username);
        if(user == null){
            throw new UsernameNotFoundException("用户名不存在");
        }
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        //用于添加用户的权限。只要把用户权限添加到authorities 就万事大吉。
        for(SysRole role:user.getRoleSet())
        {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            LOG.info(role.getName());
        }
        return new org.springframework.security.core.userdetails.User(user.getAccount(),
                user.getPassWord(), authorities);
    }
}