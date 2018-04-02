package com.jshx.lbs.service.util;

import com.jshx.lbs.config.Constants;
import com.jshx.lbs.service.mapper.MessageMapper;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Random;

/**
 * Utility class for generating random Strings.
 */
public final class RandomUtil {

    private static final int DEF_COUNT = 20;

    private RandomUtil() {
    }

    /**
     * Generate a password.
     *
     * @return the generated password
     */
    public static String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(DEF_COUNT);
    }

    /**
     * Generate an activation key.
     *
     * @return the generated activation key
     */
    public static String generateActivationKey() {
        return RandomStringUtils.randomNumeric(DEF_COUNT);
    }

    /**
    * Generate a reset key.
    *
    * @return the generated reset key
    */
    public static String generateResetKey() {
        return RandomStringUtils.randomNumeric(DEF_COUNT);
    }


    public static synchronized  Queue getCommandIdxList(MessageMapper messageMapper,int size) throws Exception{
        StringBuffer commandIdxUsedStr= new StringBuffer();
        Queue<Long> queue = new ArrayDeque<Long>();
        String commandIdxUsed = messageMapper.getCommandIdxStr();
        if(StringUtils.isNotBlank(commandIdxUsed)) {
            commandIdxUsedStr = new StringBuffer(commandIdxUsed);
        }
        boolean flag = true;
        for(int i=0;i<size;i++){
            flag = true;
            long t1 =  System.currentTimeMillis();
            while (flag == true) {
                Long value = (long)(Math.random() * 2147483648l );
                if (!commandIdxUsed.contains(value.toString())) {
                    queue.add(value);
                    commandIdxUsedStr.append(","+value.toString());
                    flag = false;
                }
            }
            long t2 =  System.currentTimeMillis();
            if((t2-t1)> Constants.RandomTimeCritical){
                throw new Exception("无法找到随机数");
            }
        }
        return queue;
    }

    public static synchronized  Long getCommandIdx(MessageMapper messageMapper) throws Exception{
        StringBuffer commandIdxUsedStr= new StringBuffer();
        Long commandIDx = 0l;
        String commandIdxUsed = messageMapper.getCommandIdxStr();
        if(StringUtils.isNotBlank(commandIdxUsed)) {
            commandIdxUsedStr = new StringBuffer(commandIdxUsed);
        }
        boolean flag = true;
        long t1 =  System.currentTimeMillis();
        while (flag == true) {
            Long value = (long)(Math.random() * 2147483648l );
            if (!commandIdxUsed.contains(value.toString())) {
                commandIdxUsedStr.append(","+value.toString());
                flag = false;
                commandIDx = value;
            }
        }
        long t2 =  System.currentTimeMillis();
        if((t2-t1)> Constants.RandomTimeCritical){
            throw new Exception("无法找到随机数");
        }
        return commandIDx;
    }
}
