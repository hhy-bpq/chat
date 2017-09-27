package com.hhy.manager;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Service;

import com.hhy.bean.SysPermission;
import com.hhy.bean.SysRole;
import com.hhy.dao.SysPermissionDao;
import com.hhy.dao.SysRoleDao;

/**
 * 路径对应的 角色
 * @author huanghaiyun
 * @createTime 2017年9月26日
 *
 */
@Service
public class MyInvocationSecurityMetadataSourceManager  implements
FilterInvocationSecurityMetadataSource {

	@Autowired
	private SysPermissionDao permissionDao;
	@Autowired
	private SysRoleDao sysRoleDao;

	private HashMap<String, Collection<ConfigAttribute>> map =null;

	/**
	 * 加载权限表中所有权限
	 */
	@Transactional
	public void loadResourceDefine(){
		map = new HashMap<>();
		Collection<ConfigAttribute> array;
		ConfigAttribute cfg;
		List<SysPermission> permissions = permissionDao.findAll();
		for(SysPermission permission : permissions) {
			array = new ArrayList<>();
			List<SysRole> list=sysRoleDao.findByPermSetName(permission.getName());
			for(SysRole role:list) {
				cfg = new SecurityConfig(role.getName());
				array.add(cfg);
			}
			//此处只添加了用户的名字，其实还可以添加更多权限的信息，例如请求方法到ConfigAttribute的集合中去。此处添加的信息将会作为MyAccessDecisionManager类的decide的第三个参数。
			//用权限的getUrl() 作为map的key，用ConfigAttribute的集合作为 value，
			map.put(permission.getUrl(), array);
		}

	}

	//此方法是为了判定用户请求的url 是否在权限表中，如果在权限表中，则返回给 decide 方法，用来判定用户是否有此权限。如果不在权限表中则放行。
	@Override
	public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
		if(map ==null) {
			loadResourceDefine();
		}
		//object 中包含用户请求的request 信息
		HttpServletRequest request = ((FilterInvocation) object).getHttpRequest();
		AntPathRequestMatcher matcher;
		for(String resUrl:map.keySet()) {
			matcher = new AntPathRequestMatcher(resUrl);
			if(matcher.matches(request)) {
				return map.get(resUrl);
			}
		}
		return null;
	}

	@Override
	public Collection<ConfigAttribute> getAllConfigAttributes() {
		return null;
	}

	@Override
	public boolean supports(Class<?> clazz) {
		return true;
	}
}