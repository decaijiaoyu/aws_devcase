package com.awspaas.user.apps.devcase.util;


import java.security.MessageDigest;

public class SecurityTools {

    /**
     * 解密
     * @param val 解密字符串
     * @param token 关键字
     * @param type 方式
     * @return 字符串
     */
    public String decrypt(String val,String token,String type){
        String str = "";
        if(type.equals("md5")){
            str = decryptByMD5(val,token);
        }
        return str;
    }


    /**
     * 加密
     * @param val 加密字符串
     * @param token 关键字
     * @param type 方式
     * @return 字符串
     */
    public String encrypt(String val,String token,String type){
        String str = "";
        if(type.equals("md5")){
            str = encryptByMD5(val,token);
        }
        return str;
    }


    /**
     * c730加密
     * @param val 加密字符串
     * @param token 关键字
     * @return 字符串
     */
    private String encryptByMD5(String val,String token){
        MessageDigest md5 = null;
        if(val.length()==0){
            return "";
        }
        try{
            md5 = MessageDigest.getInstance("MD5");
        }catch (Exception e){
            e.printStackTrace();
            return "";
        }


        return "";
    }

    private String decryptByMD5(String val,String token){

        return "";
    }
}
