package com.hhy.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hhy.daoservice.CustomUserService;
import com.hhy.util.MD5Util;
/**
 * security 配置
 * @author huanghaiyun
 * @createTime 2017年9月18日
 *
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Bean
	UserDetailsService customUserService(){ //注册UserDetailsService 的bean
		return new CustomUserService();
	}
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(customUserService())
		.passwordEncoder(new PasswordEncoder(){

			@Override
			public String encode(CharSequence rawPassword) {
				return MD5Util.encode((String)rawPassword);
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				return encodedPassword.equals(MD5Util.encode((String)rawPassword));
			}}); //user Details Service验证
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
			.antMatchers("/js/**","/img/**","/css/**","/html/**").permitAll() 
			.anyRequest().authenticated()//任何请求,登录后可以访问
			.and()
			.formLogin()
			.loginPage("/login")//登陆提交的处理url
			.failureUrl("/login?error")
			.defaultSuccessUrl("/chat")//登录成功的 跳转url
			.permitAll()
			.and()
			.logout()
			.logoutUrl("/logout").permitAll()//退出url 
			.logoutSuccessUrl("/?logout=true")//退出成功后跳转的url
			.and()
			//开启cookie保存用户数据
			.rememberMe()
			//设置cookie有效期
			.tokenValiditySeconds(60 * 60 * 24 * 7);//登录页面用户任意访问
	}

}