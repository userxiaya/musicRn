package com.musicrn.tools;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

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

    private static void sendEvent(ReactContext reactContext,
                                  String eventName,
                                  @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public static void notifyCallback(String status) {
        WritableMap params = Arguments.createMap();
        params.putString("status", status);
        sendEvent(reactContext, "notifyCallback", params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }
    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }
    @ReactMethod
    public void notifyMusic(String songName, String artistName, String imgUrl) {
       new NotifyManager().notifyMusic(songName, artistName, imgUrl);
    }
    @ReactMethod
    public void setNotifyPlayStatus(Boolean playStatus) {
        new NotifyManager().pauseOrPlay(playStatus);
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
