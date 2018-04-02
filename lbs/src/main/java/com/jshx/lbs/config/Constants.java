package com.jshx.lbs.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Application constants.
 */
public final class Constants {

    //Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";

    public static final String SYSTEM_ACCOUNT = "system";
    public static final String ANONYMOUS_USER = "anonymoususer";

    //查询地区校验码
    public static final String CHECK_CODE = "JJjiaotong";
    //查询地区校验码
    public static final String GET_ADDRESS_URL = "http://202.102.112.27:8700/api/gismicros/getPoiDistance";

    // 立即升级
    public static final int MSG_NOW = 0;
    //
    public static final int MSG_INTERVAL = 1;

    public static Map<Integer,String> MSG_UPDATE_MAP = new HashMap<Integer,String>();
    static{
        MSG_UPDATE_MAP.put(0,"立即升级");
        MSG_UPDATE_MAP.put(1,"策略升级");
    }


    public static int TYPE_YEAR = 1;
    public static int TYPE_MONTH = 2;
    public static int TYPE_WEEK = 3;
    public static int SUM_ALARM_TYPE = -1;
;
    public static Map<Integer,String> ALARM_TYPE_COUNT_MAP = new HashMap<Integer,String>();
    static{
        ALARM_TYPE_COUNT_MAP.put(-1,"全部报警");
        ALARM_TYPE_COUNT_MAP.put(501,"前向碰撞报警");
        ALARM_TYPE_COUNT_MAP.put(502,"车道偏离报警");
        ALARM_TYPE_COUNT_MAP.put(503,"车距过近报警");
        ALARM_TYPE_COUNT_MAP.put(504,"疲劳驾驶报警");
        ALARM_TYPE_COUNT_MAP.put(505,"分神驾驶报警");
        ALARM_TYPE_COUNT_MAP.put(506,"接打电话报警");
        ALARM_TYPE_COUNT_MAP.put(507,"抽烟报警");
        ALARM_TYPE_COUNT_MAP.put(508,"驾驶员异常报警");
        //ALARM_TYPE_COUNT_MAP.put(509,"胎压异常报警");
    }

    public static Map<String,String> ALARM_TYPE_NAME_MAP = new HashMap<String,String>();
    static{
        ALARM_TYPE_NAME_MAP.put("NO_501","前向碰撞报警");
        ALARM_TYPE_NAME_MAP.put("NO_502","车道偏离报警");
        ALARM_TYPE_NAME_MAP.put("NO_503","车距过近报警");
        ALARM_TYPE_NAME_MAP.put("NO_504","疲劳驾驶报警");
        ALARM_TYPE_NAME_MAP.put("NO_505","分神驾驶报警");
        ALARM_TYPE_NAME_MAP.put("NO_506","接打电话报警");
        ALARM_TYPE_NAME_MAP.put("NO_507","抽烟报警");
        ALARM_TYPE_NAME_MAP.put("NO_508","驾驶员异常报警");
        //ALARM_TYPE_NAME_MAP.put("NO_509","胎压异常报警");
    }

    public static Map<String,Integer> ALARM_TYPE_SORT_MAP = new HashMap<String,Integer>();
    static{
        ALARM_TYPE_SORT_MAP.put("TOTAL_NO",1);
        ALARM_TYPE_SORT_MAP.put("NO_501",2);
        ALARM_TYPE_SORT_MAP.put("NO_502",3);
        ALARM_TYPE_SORT_MAP.put("NO_503",4);
        ALARM_TYPE_SORT_MAP.put("NO_504",5);
        ALARM_TYPE_SORT_MAP.put("NO_505",6);
        ALARM_TYPE_SORT_MAP.put("NO_506",7);
        ALARM_TYPE_SORT_MAP.put("NO_507",8);
        ALARM_TYPE_SORT_MAP.put("NO_508",9);
        //ALARM_TYPE_SORT_MAP.put("NO_509",10);
    }

    public static Map<String,String> ALARM_TREAT_MAP = new HashMap<String,String>();
    static{
        ALARM_TREAT_MAP.put("-1","全部报警");
        ALARM_TREAT_MAP.put("0","处理中");
        ALARM_TREAT_MAP.put("1","已处理完毕");
        ALARM_TREAT_MAP.put("2","不作处理");
        ALARM_TREAT_MAP.put("3","将来处理");
        ALARM_TREAT_MAP.put("4","未处理报警");
    }

    public static Map<String,String> ALARM_LEVEL_MAP = new HashMap<String,String>();
    static{
        ALARM_LEVEL_MAP.put("0","一级报警");
        ALARM_LEVEL_MAP.put("1","二级报警");
    }

    public static Map<Integer,Integer> ALARM_TYPE_CRITICAL_MAP = new HashMap<Integer,Integer>();
    static{
        ALARM_TYPE_CRITICAL_MAP.put(501,200);
        ALARM_TYPE_CRITICAL_MAP.put(502,150);
        ALARM_TYPE_CRITICAL_MAP.put(503,1);
        ALARM_TYPE_CRITICAL_MAP.put(504,1);
        ALARM_TYPE_CRITICAL_MAP.put(505,1);
        ALARM_TYPE_CRITICAL_MAP.put(506,1);
        ALARM_TYPE_CRITICAL_MAP.put(507,1);
        ALARM_TYPE_CRITICAL_MAP.put(508,1);
        ALARM_TYPE_CRITICAL_MAP.put(509,1);
    }

    public static Map<Integer,Integer> ALARM_TYPE_SCORE_MAP = new HashMap<Integer,Integer>();
    static{
        ALARM_TYPE_SCORE_MAP.put(501,15);
        ALARM_TYPE_SCORE_MAP.put(502,8);
        ALARM_TYPE_SCORE_MAP.put(503,8);
        ALARM_TYPE_SCORE_MAP.put(504,15);
        ALARM_TYPE_SCORE_MAP.put(505,15);
        ALARM_TYPE_SCORE_MAP.put(506,8);
        ALARM_TYPE_SCORE_MAP.put(507,8);
        ALARM_TYPE_SCORE_MAP.put(508,15);
        ALARM_TYPE_SCORE_MAP.put(509,8);
    }



    public  static int AlarmTypeSecess = -1;
    public  static int AlarmTypeError = 1;
    public  static int startTimeError = 2;
    public  static int endTimeError = 3;
    public  static int ExceptionError = 4;

    public static int SUCCESS =0;
    public static int FAULT =1;



    public static Map<Integer,String> PHOTO_DEAL_MAP = new HashMap<Integer,String>();
    static{
        PHOTO_DEAL_MAP.put(1,"审核通过");
        PHOTO_DEAL_MAP.put(0,"审核不通过");
    }

    public static Map<Integer,String> PHOTO_COMPARA_MAP = new HashMap<Integer,String>();
    static{
        PHOTO_COMPARA_MAP.put(1,"比对通过");
        PHOTO_COMPARA_MAP.put(0,"比对不通过");
    }

    public static Map<String,String> COLOR_MAP = new HashMap<String,String>();
    static{
        COLOR_MAP.put("1","蓝");
        COLOR_MAP.put("2","黄");
        COLOR_MAP.put("3","黑");
        COLOR_MAP.put("4","白");
        COLOR_MAP.put("5","绿");
        COLOR_MAP.put("6","黄绿");
        COLOR_MAP.put("8","农黄");
        COLOR_MAP.put("9","其他");
    }

    public static Map<String,String> DEVICE_TYPE_MAP = new HashMap<String,String>();

    static{
        DEVICE_TYPE_MAP.put("100","ADAS");
        DEVICE_TYPE_MAP.put("101","DSM");
        DEVICE_TYPE_MAP.put("102","TPMS");
        DEVICE_TYPE_MAP.put("103","BSD");
    }
    public static int MSG_SUCCESS=0;

    public static String PIC_TYPE = "00";
    public static String VOICE_TYPE = "01";
    public static String MOVIE_TYPE = "02";
    public static String TXT_TYPE = "03";
    public static String OTHER_TYPE = "04";


    public static long RandomTimeCritical = 5000 ;
}
