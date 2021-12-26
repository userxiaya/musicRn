package com.musicrn.tools;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class musicTools extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public musicTools(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    @NonNull
    @Override
    public String getName() {
        return "musicTools";
    }
    @ReactMethod
    public void notifyMusic(String songName, String artistName, String imgUrl) {
       new NotifyManager().notifyMusic(songName, artistName, imgUrl);
    }
    //关闭通知栏
    @ReactMethod
    public void closeNotify() {
       new NotifyManager().destory();
    }
    @ReactMethod
    public void getBackGroundByImage(String image, Callback successCallback, Callback errorCallback) {
        tools.getBackgroundByUrl(image,successCallback, errorCallback);
    }
}
