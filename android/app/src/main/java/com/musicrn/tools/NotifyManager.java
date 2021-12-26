package com.musicrn.tools;

import static android.content.Context.NOTIFICATION_SERVICE;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

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
    private static ButtonBroadcastReceiver receiver;
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

    public void pauseOrPlay(Boolean playStatus) {
        if(mNotification != null) {
            int btn = playStatus == true ? R.drawable.ic_pause : R.drawable.ic_play;
            notRemoteView.setImageViewResource(R.id.notificationPlayPause, btn);
            bigNotRemoteView.setImageViewResource(R.id.notificationPlayPause,  btn);
            mNotificationManager.notify(NOTIFICATION_ID, mNotificationBuilder.build());
        }
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

    public void notifyCallback(String status) {
        musicTools.notifyCallback(status);
    }

    public void setOnClick (RemoteViews mRemoteViews) {
        //注册广播
        if (receiver == null){
            receiver = new ButtonBroadcastReceiver();
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ACTION_BUTTON);
        getContext().registerReceiver(receiver, intentFilter);
        //设置点击的事件
        Intent buttonIntent = new Intent(ACTION_BUTTON);
        /* 播放/暂停  按钮 */
        buttonIntent.putExtra(INTENT_BUTTONID_TAG, BUTTON_PLAY_ID);
        PendingIntent intent_play = PendingIntent.getBroadcast(getContext(), BUTTON_PLAY_ID, buttonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        mRemoteViews.setOnClickPendingIntent(R.id.notificationPlayPause, intent_play);
        /* 下一个  按钮 */
        buttonIntent.putExtra(INTENT_BUTTONID_TAG, BUTTON_NEXT_ID);
        PendingIntent intent_next = PendingIntent.getBroadcast(getContext(), BUTTON_NEXT_ID, buttonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        mRemoteViews.setOnClickPendingIntent(R.id.notificationFForward, intent_next);

        /* 上一个  按钮 */
        buttonIntent.putExtra(INTENT_BUTTONID_TAG, BUTTON_LAST_ID);
        PendingIntent intent_last = PendingIntent.getBroadcast(getContext(), BUTTON_LAST_ID, buttonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        mRemoteViews.setOnClickPendingIntent(R.id.notificationFRewind, intent_last);
        /* 关闭  按钮 */
        buttonIntent.putExtra(INTENT_BUTTONID_TAG, BUTTON_CLOSE_ID);
        PendingIntent intent_close = PendingIntent.getBroadcast(getContext(), BUTTON_CLOSE_ID, buttonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        mRemoteViews.setOnClickPendingIntent(R.id.notificationStop, intent_close);
    }


    /**
     * （通知栏中的点击事件是通过广播来通知的，所以在需要处理点击事件的地方注册广播即可）
     * 广播监听按钮点击事件
     */
    public class ButtonBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(ACTION_BUTTON)) {
                //通过传递过来的ID判断按钮点击属性或者通过getResultCode()获得相应点击事件
                int buttonId = intent.getIntExtra(INTENT_BUTTONID_TAG, 0);
                switch (buttonId) {
                    case BUTTON_PLAY_ID:
                        notifyCallback("playOrPause");
                        break;
                    case BUTTON_NEXT_ID:
                        notifyCallback("nextSong");
                        break;
                    case BUTTON_LAST_ID:
                        notifyCallback("lastSong");
                        break;
                    case BUTTON_CLOSE_ID:
                        destory();
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
