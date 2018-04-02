package com.jshx.lbs.web.rest.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesUtil {
    private static Properties properties;

	public static String getProperties(String key){
	    if(properties == null){
            properties = new Properties();
            // 使用ClassLoader加载properties配置文件生成对应的输入流
            InputStream in = PropertiesUtil.class.getClassLoader().getResourceAsStream("config/prop.properties");
            try{
                // 使用properties对象加载输入流
                 properties.load(in);
            }catch(Exception e){
                e.printStackTrace();
                return null;
            }
        }
        //获取key对应的value值
        return properties.getProperty(key);

	}

	public static String getPropertiesByAddress(String Address,String key){
		 Properties properties = new Properties();
	    // 使用ClassLoader加载properties配置文件生成对应的输入流
	    InputStream in = PropertiesUtil.class.getClassLoader().getResourceAsStream(Address);
	    // 使用properties对象加载输入流
	    try{
	    	properties.load(in);
	    }catch(Exception e){
	    	e.printStackTrace();
	    	return null;
	    }
	    //获取key对应的value值
	    return properties.getProperty(key);
	}

}
