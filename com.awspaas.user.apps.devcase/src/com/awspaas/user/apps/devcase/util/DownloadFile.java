package com.awspaas.user.apps.devcase.util;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

public class DownloadFile {

    private static DownloadFile downloadFile;

    private DownloadFile(){

    }

    public static DownloadFile getInstance() {
        if (downloadFile == null) {
            synchronized (DownloadFile.class) {
                if (downloadFile == null) {
                    downloadFile = new DownloadFile();
                }
            }
        }
        return downloadFile;
    }

    public File downloadNet(String netPath, String fileName, String localPath) {

        File file = null;
        int byteread = 0;
        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            URL url = new URL(netPath);
            URLConnection urlConnection = url.openConnection();
            inputStream = urlConnection.getInputStream();
            file = new File(localPath);
            if (!file.exists()) {
                file.mkdirs();
            }

            fileOutputStream = new FileOutputStream(new File(localPath + fileName));

            byte[] bytes = new byte[1024];
            while ((byteread = inputStream.read(bytes)) != -1) {
                fileOutputStream.write(bytes, 0, byteread);
            }

            file = new File(localPath + fileName);
            return file;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }finally {

            try {
                fileOutputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
