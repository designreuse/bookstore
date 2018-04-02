package com.jshx.lbs.web.rest.util;

import com.jshx.lbs.repository.TreeArrayDataRepository;
import net.sf.json.JSONObject;
import org.springframework.context.ApplicationContext;
import redis.clients.jedis.Jedis;

import java.util.List;

public class testredis {

    private String userName = "cesi";

    private String companyId = "3184c8fd-24f0-4a00-9067-7df97ed3cd8b";


//    public static void main(String[] args) {
//        Jedis jedis = null;
//        jedis = RedisUtils.getPool().getResource();
////        System.out.println(jedis.hget("car_sum","410000"));
////        System.out.println(jedis.hget("car_sum","410000_1"));
////        System.out.println(jedis.hget("car_sum","410000_2"));
////        System.out.println(jedis.hget("car_online_sum_his","410000"));
////		System.out.println(jedis.hget("car_online_sum_his","410500"));
////
////		System.out.println(jedis.hget("car_notOnline_sum_his","410500"));
////		System.out.println(jedis.hget("car_sum","410500"));
////		System.out.println(jedis.hget("company_sum","410000"));
////        //System.out.println(jedis.hget("car_online_sum","410500_0"));
////        System.out.println(jedis.hget("alarm_sum","410000_1"));
////        System.out.println(jedis.hget("alarm_sum","410000_2"));
////        System.out.println(jedis.hget("alarm_sum","410000_3"));
////        System.out.println(jedis.hget("alarm_sum","410000_4"));
////        System.out.println("----------------------------------------");
////        System.out.println(jedis.hget("car_online_sum","0055D447EFA3112DE055000000000001_asc_1"));
////        System.out.println(jedis.hget("car_online_sum","0055D447EFA3112DE055000000000001_asc_2"));
////        System.out.println(jedis.hget("car_online_sum","410000_3"));
////        System.out.println(jedis.hget("car_online_sum","410000_4"));
////        System.out.println(jedis.hget("car_online_sum","410000_5"));
////        System.out.println(jedis.hget("car_online_sum","410000_6"));
////        System.out.println(jedis.hget("car_online_sum","410000_7"));
////        System.out.println(jedis.hget("car_online_sum","410000_8"));
////        System.out.println(jedis.hget("car_online_sum","410000_9"));
////        System.out.println(jedis.hget("car_online_sum","410000_10"));
//
////        System.out.println(jedis.hget("LBSCACHE:LKYWHN.T_CAR:豫AD0130_1","CAR_ICON"));
//
////        jedis.hset("car_sum", "410000_60", "0");
////        jedis.hset("car_sum", "410100_60", "0");
////        jedis.hset("car_sum", "410200_60", "0");
////        jedis.hset("car_sum", "410300_60", "0");
////        jedis.hset("car_sum", "410400_60", "0");
////        jedis.hset("car_sum", "410500_60", "0");
////        jedis.hset("car_sum", "410600_60", "0");
////        jedis.hset("car_sum", "410700_60", "0");
////        jedis.hset("car_sum", "410800_60", "0");
////        jedis.hset("car_sum", "410900_60", "0");
////        jedis.hset("car_sum", "411000_60", "0");
////        jedis.hset("car_sum", "411100_60", "0");
////        jedis.hset("car_sum", "411200_60", "0");
////        jedis.hset("car_sum", "411300_60", "0");
////        jedis.hset("car_sum", "411400_60", "0");
////        jedis.hset("car_sum", "411500_60", "0");
////        jedis.hset("car_sum", "411600_60", "0");
////        jedis.hset("car_sum", "411700_60", "0");
////        jedis.hset("car_sum", "411800_60", "0");
////        jedis.hset("car_sum", "419001_60", "0");
//
//        String str = jedis.lrange("SysUser",0,-1).get(0);
//        JSONObject jsonStr = JSONObject.fromObject(str);
//
//
//        System.out.println(jsonStr.getString("id"));
////        System.out.println(jedis.hget("car_sum","419001_60"));
//
//        RedisUtils.returnResource(jedis);
//    }
}
