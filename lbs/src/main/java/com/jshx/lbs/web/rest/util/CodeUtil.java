package com.jshx.lbs.web.rest.util;

import com.sun.crypto.provider.SunJCE;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.security.MessageDigest;
import java.security.Security;
import java.sql.Blob;

public class CodeUtil {

    public static final String MD5 = "MD5";
    public static final String DigestAlgorithm = "SHA1";
    public static final String KeyAlgorithm = "DESede";
    public static final String CryptAlgorithm = "DESede/CBC/PKCS5Padding";
    private static final String keyString = "3497C134D60D7F9E404916BA3252F8C85E8AEA1315626EC1";
    private static final byte[] IV;
    private static final String encoding = "UTF-8";

    static {
        Security.addProvider(new SunJCE());
        IV = new byte[]{1, 2, 3, 4, 5, 6, 7, 8};
    }

    public CodeUtil() {
    }

    public static byte[] base64Encode(byte[] b) {
        return Base64.encode(b);
    }

    public static byte[] base64Decode(byte[] b) {
        return Base64.decode(b);
    }

//    public static byte[] base64Decode(String s) { return Base64.decode(s);}

    public static String generateDigest(String strTobeDigest) throws Exception {
        byte[] input = strTobeDigest.getBytes("UTF-8");
        byte[] output = (byte[])null;
        MessageDigest DigestGenerator = MessageDigest.getInstance("SHA1");
        DigestGenerator.update(input);
        output = DigestGenerator.digest();
        return new String(base64Encode(output));
    }

    private static Key keyGenerator(String KeyStr) throws Exception {
        byte[] input = Hex.decode(KeyStr);
        DESedeKeySpec KeySpec = new DESedeKeySpec(input);
        SecretKeyFactory KeyFactory = SecretKeyFactory.getInstance("DESede");
        return KeyFactory.generateSecret(KeySpec);
    }

    private static IvParameterSpec IvGenerator(byte[] b) throws Exception {
        IvParameterSpec IV = new IvParameterSpec(b);
        return IV;
    }

    public static String encrypt(String strTobeEnCrypted) throws Exception {
        byte[] input = strTobeEnCrypted.getBytes("UTF-8");
        Key k = keyGenerator("3497C134D60D7F9E404916BA3252F8C85E8AEA1315626EC1");
        IvParameterSpec IVSpec = IvGenerator(IV);
        Cipher c = Cipher.getInstance("DESede/CBC/PKCS5Padding");
        c.init(1, k, IVSpec);
        byte[] output = c.doFinal(input);
        return new String(base64Encode(output), "UTF-8");
    }

//    public static String decrypt(String strTobeDeCrypted) throws Exception {
//        byte[] input = base64Decode(strTobeDeCrypted);
//        Key k = keyGenerator("3497C134D60D7F9E404916BA3252F8C85E8AEA1315626EC1");
//        IvParameterSpec IVSpec = IvGenerator(IV);
//        Cipher c = Cipher.getInstance("DESede/CBC/PKCS5Padding");
//        c.init(2, k, IVSpec);
//        byte[] output = c.doFinal(input);
//        return new String(output, "UTF-8");
//    }

    public static String encode(String password, String algorithm) {
        byte[] unencodedPassword = password.getBytes();
        MessageDigest md = null;

        try {
            md = MessageDigest.getInstance(algorithm);
        } catch (Exception var7) {
            return password;
        }

        md.reset();
        md.update(unencodedPassword);
        byte[] encodedPassword = md.digest();
        StringBuffer buf = new StringBuffer();

        for(int i = 0; i < encodedPassword.length; ++i) {
            if ((encodedPassword[i] & 255) < 16) {
                buf.append("0");
            }

            buf.append(Long.toString((long)(encodedPassword[i] & 255), 16));
        }

        return buf.toString();
    }


    /**
     * blob转换为byte
     *
     * @author WMS 2015-8-24 下午6:09:32
     */
    public static byte[] blobToBytes(Blob blob)
    {
        InputStream is = null;
        byte[] b = null;
        try
        {
            is = blob.getBinaryStream();
            b = new byte[(int)blob.length()];
            is.read(b);
            return b;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
                is.close();
                is = null;
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
        return b;
    }
}
