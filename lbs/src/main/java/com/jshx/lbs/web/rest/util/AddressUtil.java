package com.jshx.lbs.web.rest.util;

import com.jshx.lbs.config.Constants;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class AddressUtil {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    public static String getAddress(String longitude,String latitude){
        if(StringUtils.isBlank(longitude)||StringUtils.isBlank(latitude)){
            return "";
        }
        String message = Constants.GET_ADDRESS_URL + "?x="+latitude+"&y="+longitude+"&perCode="+Constants.CHECK_CODE;
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet httpget = new HttpGet(message);
        HttpResponse response = null;
        String address = "";
        try {
            response = httpclient.execute(httpget);
            response.getEntity().getContent();
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent(),"UTF-8"));

                String line = "";
                while ((line = br.readLine()) != null) {
                    address+=line;
                }
                br.close();
            }
            return address.split(" ")[0];
        } catch (IOException e) {
            return "";
        }
    }


}
