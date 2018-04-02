package com.jshx.lbs.web.rest.util;

import com.amazonaws.auth.PropertiesCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Calendar;

public class OOSUtil {
    public static  AmazonS3 oos = null;
    public static  String address = PropertiesUtil.getProperties("OOSAddress");
    public static String getShareUrl(String key){
        AmazonS3 oos = getOOS();
        String bucketName = PropertiesUtil.getProperties("OOSBucketName");
        key = PropertiesUtil.getProperties("OOSKeyPrefix")+"/"+key;
        System.out.println("=====================================");
        System.out.println("Getting Started with OOS");
        System.out.println("=====================================");
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 1);
        URL url = oos.generatePresignedUrl(bucketName, key, cal.getTime());
        String urlStr = url.toString();
        urlStr= address+"/"+bucketName+"/"+urlStr.substring(urlStr.indexOf(URLEncoder.encode(key)));
        return urlStr;
    }

    public static byte[] getIO(String key) throws IOException {
        AmazonS3 oos = getOOS();
        String bucketName = PropertiesUtil.getProperties("OOSBucketName");
        key = PropertiesUtil.getProperties("OOSKeyPrefix")+"/"+key;
        S3Object object = oos.getObject(new GetObjectRequest(bucketName, key));
        //System.out.println("Content-Type: " + object.getObjectMetadata().getContentType());
        InputStream inStream = object.getObjectContent();
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len = -1;
        while((len = inStream.read(buffer)) != -1){
            outStream.write(buffer, 0, len);
        }
        outStream.close();
        inStream.close();
        return outStream.toByteArray();
    }

    public static AmazonS3 getOOS(){
        if(oos == null){
            try {
                oos = new AmazonS3Client(
                    new PropertiesCredentials(OOSUtil.class.getClassLoader().getResourceAsStream("config/OOSCredentials.properties")));
            } catch (IOException e) {
                e.printStackTrace();
                System.out.println("地址配置错误");
            }
            // 设置endpoint到OOS
            oos.setEndpoint(address);
            return oos;
        }else{
            return oos;
        }
    }
}
