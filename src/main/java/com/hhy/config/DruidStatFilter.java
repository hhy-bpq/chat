package com.hhy.config;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

import com.alibaba.druid.support.http.WebStatFilter;

/**
 * 配置druid监控统计功能
 * 配置Filter
 * @author hhy
 *
 */

@WebFilter(filterName = "druidWebStatFilter", urlPatterns = "/*",
    initParams = {
            @WebInitParam(name="exclusions",value="*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*")// 忽略资源
    }
)
public class DruidStatFilter extends WebStatFilter {

}