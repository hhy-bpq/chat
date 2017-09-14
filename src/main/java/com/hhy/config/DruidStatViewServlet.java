package com.hhy.config;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

import com.alibaba.druid.support.http.StatViewServlet;


/**
 * 配置druid监控统计功能
 * 在SpringBoot项目中基于注解的配置，如果是web.xml配置，按规则配置即可
 * @author hhy
 *
 */

@WebServlet(urlPatterns = "/druid/*",
    initParams = {
//          @WebInitParam(name = "allow", value = "localhost,127.0.0.1"), // IP白名单 (没有配置或者为空，则允许所有访问)
//          @WebInitParam(name="deny",value="127.0.0.1"), // IP黑名单 (存在共同时，deny优先于allow)
            @WebInitParam(name="loginUsername",value="druid"),// 用户名
            @WebInitParam(name="loginPassword",value="druid"),// 密码
            @WebInitParam(name="resetEnable",value="false")// 禁用HTML页面上的“Reset All”功能
    }
)
public class DruidStatViewServlet extends StatViewServlet {

}