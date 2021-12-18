package com.musicrn.notify;

import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class musicNotify extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public musicNotify(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    @NonNull
    @Override
    public String getName() {
        return "musicNotify";
    }
    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
    @ReactMethod
    public void getBackGroundByImage(String image, Callback successCallback, Callback errorCallback) {
        tools.getBackgroundByUrl(image,successCallback, errorCallback);
    }
}
