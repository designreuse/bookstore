package com.jshx.lbs.web.rest.util;


import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisUtils {
    private static String ADDR = "202.102.108.23";

    private static int PORT = 6379;

//    private static String AUTH = "admin";

    private static int MAX_ACTIVE = 500;

    private static int MAX_IDLE = 5;

    private static int MAX_WAIT = 100000;

    private static int TIMEOUT = 100000;

	private static JedisPool pool = null;

    JedisPoolConfig config = new JedisPoolConfig();

    /**
     * 构建redis连接池
     *
     * @return JedisPool
     */
    public static JedisPool getPool() {
        if (pool == null) {
            JedisPoolConfig config = new JedisPoolConfig();
            // 控制一个pool可分配多少个jedis实例，通过pool.getResource()来获取；
            // 如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。
            config.setMaxActive(MAX_ACTIVE);
            // 控制一个pool最多有多少个状态为idle(空闲的)的jedis实例。
            config.setMaxIdle(MAX_IDLE);
            // 表示当borrow(引入)一个jedis实例时，最大的等待时间，如果超过等待时间，则直接抛出JedisConnectionException；
            config.setMaxWait(MAX_WAIT);
            // 在borrow一个jedis实例时，是否提前进行validate操作；如果为true，172.31.250.237则得到的jedis实例均是可用的；
            config.setTestOnBorrow(true);

            config.setTestOnReturn(true);

            pool = new JedisPool( config, ADDR, PORT,TIMEOUT);
        }
        return pool;
    }

	public Jedis getJedis(){
//		pool = new JedisPool(new JedisPoolConfig(),"202.102.108.23",6379);
        pool = getPool();

		Jedis jedis = pool.getResource();

		return jedis;
	}

	/**
	 * 销毁jedis,
	 * @param jedis
	 */
	public void destoryJedis(Jedis jedis){

		pool.returnBrokenResource(jedis);
		pool.destroy();
	}
	/**
	 * 回收资源
	 * @param redis
	 */
	public static void returnResource(Jedis redis) {
		if (redis != null) {
			pool.returnResource(redis);
		}
	}
	/**
	 * 销毁资源
	 * @param jedis
	 */
	public static void returnBrokenResource(Jedis jedis) {
		if (jedis != null) {
			pool.returnBrokenResource(jedis);
		}
	}



}
