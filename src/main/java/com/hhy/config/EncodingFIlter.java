package com.hhy.config;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

import org.springframework.web.filter.CharacterEncodingFilter;

import com.alibaba.druid.support.http.WebStatFilter;

/**
 * 
 * @author huanghaiyun
 * @createTime 2017年9月25日
 *
 */

@WebFilter(filterName = "encodingFilter", urlPatterns = "*.html",
    initParams = {
            @WebInitParam(name="encoding",value="UTF8"),@WebInitParam(name="forceEncoding",value="false")
    }
)
public class EncodingFIlter extends CharacterEncodingFilter {

}