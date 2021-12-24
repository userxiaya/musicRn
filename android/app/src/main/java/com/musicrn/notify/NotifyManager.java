package com.musicrn.notify;

import static android.content.Context.NOTIFICATION_SERVICE;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;

import com.musicrn.MainApplication;
import com.musicrn.R;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class NotifyManager {
    private static NotificationManager mNotificationManager;
    private static NotificationCompat.Builder mNotificationBuilder;
    private static Notification mNotification;

    /**
     * 通知栏按钮点击事件对应的ACTION（标识广播）
     */
    public final static String ACTION_BUTTON = "com.notification.intent.action.ButtonClick";
    public final static String INTENT_BUTTONID_TAG = "ButtonId";
    /**
     * 播放/暂停 按钮点击 ID
     */
    public final static int BUTTON_PLAY_ID = 1;
    public final static int BUTTON_NEXT_ID = 2;
    public final static int BUTTON_LAST_ID = 3;
    public final static int BUTTON_CLOSE_ID = 4;

    private static final int NOTIFICATION_ID = 999;
    private long mNotificationPostTime = 0;

    private static RemoteViews notRemoteView;
    private static RemoteViews bigNotRemoteView;
    private Context getContext(){
        return new MainApplication().getContext();
    }
    public void notifyMusic(String songName, String artistName, String imgUrl) {
        destory();
        if(mNotificationManager == null) {
            initNotify();
        }
        update(songName, artistName, imgUrl);
    }
    private void initNotify() {
        mNotificationManager = (NotificationManager) getContext().getSystemService(NOTIFICATION_SERVICE);

        Intent nowPlayingIntent = new Intent();
        nowPlayingIntent.setAction("notification");
        if (mNotificationPostTime == 0) {
            mNotificationPostTime = System.currentTimeMillis();
        }
        notRemoteView = new RemoteViews(getContext().getPackageName(), R.layout.player_notification);
        bigNotRemoteView = new RemoteViews(getContext().getPackageName(), R.layout.player_notification_expanded);

        setOnClick(bigNotRemoteView);
        setOnClick(notRemoteView);

        notRemoteView.setTextViewText(R.id.notificationSongName, "title");
        notRemoteView.setTextViewText(R.id.notificationArtist, "name");

        bigNotRemoteView.setTextViewText(R.id.notificationSongName, "title");
        bigNotRemoteView.setTextViewText(R.id.notificationArtist, "name");

        mNotificationBuilder = new NotificationCompat.Builder(getContext(), initChannelId())
                .setSmallIcon(R.drawable.ic_music)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setCustomContentView(notRemoteView)
                .setCustomBigContentView(bigNotRemoteView)
                .setWhen(mNotificationPostTime);

        mNotification = mNotificationBuilder.build();
    }
    private String initChannelId() {
        // 通知渠道的id
        String id = "music_ring_007";
        // 用户可以看到的通知渠道的名字.
        CharSequence name = "monica";
        // 用户可以看到的通知渠道的描述
        String description = "通知栏播放控制";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_LOW;
            NotificationChannel mChannel;
            mChannel = new NotificationChannel(id, name, importance);
            mChannel.setDescription(description);
            //最后在notificationmanager中创建该通知渠道
            mNotificationManager.createNotificationChannel(mChannel);
        }
        return id;
    }
    // 设置网络资源cover图
    public void setCover(final String url) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Bitmap bm = null;
                    URL iconUrl = new URL(url);
                    URLConnection conn = iconUrl.openConnection();
                    HttpURLConnection http = (HttpURLConnection) conn;

                    int length = http.getContentLength();

                    conn.connect();
                    // 获得图像的字符流
                    InputStream is = conn.getInputStream();
                    BufferedInputStream bis = new BufferedInputStream(is, length);
                    bm = BitmapFactory.decodeStream(bis);
                    notRemoteView.setImageViewBitmap(R.id.notificationCover, bm);
                    bigNotRemoteView.setImageViewBitmap(R.id.notificationCover, bm);
                    mNotificationManager.notify(NOTIFICATION_ID, mNotificationBuilder.build());
                    bis.close();
                    is.close();// 关闭流
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }


    public void update(final String songName, final String artistName, final String imgUrl) {
        if (mNotification != null) {
            notRemoteView.setImageViewResource(R.id.notificationCover, R.drawable.default_cover);
            bigNotRemoteView.setImageViewResource(R.id.notificationCover,  R.drawable.default_cover);
            notRemoteView.setTextViewText(R.id.notificationSongName, songName);
            notRemoteView.setTextViewText(R.id.notificationArtist, artistName);
            bigNotRemoteView.setTextViewText(R.id.notificationSongName, songName);
            bigNotRemoteView.setTextViewText(R.id.notificationArtist, artistName);
         
            mNotificationManager.notify(NOTIFICATION_ID, mNotificationBuilder.build());
            setCover(imgUrl);
        }
    }
    public void setOnClick (RemoteViews mRemoteViews) {

    }

    public void destory() {
        /**
         * 关闭通知
         */
        if (mNotificationManager != null) {
            mNotificationManager.cancel(NOTIFICATION_ID);
            mNotificationManager = null;
            mNotification = null;
        }
    }
}
