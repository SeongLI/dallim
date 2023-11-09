package com.dallim;


import android.app.IntentService;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.RemoteViews;

import com.dallim.AttendanceApiService;
import com.dallim.CalendarWidget;
import com.dallim.R;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.Arrays;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UpdateWidgetService extends IntentService {

    // Retrofit 관련 멤버 변수
    private Retrofit retrofit;
    private AttendanceApiService service;

    public UpdateWidgetService() {
        super("UpdateWidgetService");
        Log.d("DDDDDDDDDD", "UpdateWidgetService");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate");
            // 액세스 토큰을 SharedPreferences에서 가져오기
            SharedPreferences sharedPreferences = getSharedPreferences("dallimPreference", Context.MODE_PRIVATE);
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate - dallimPreference");
            String accessToken = sharedPreferences.getString("AccessToken", "");
            // Retrofit 인스턴스 및 서비스 초기화
            // Retrofit을 사용하여 서비스 인스턴스 생성하기 전에 OkHttpClient를 사용하여 헤더 추가
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate - accessToken");
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .addInterceptor(chain -> {
                        Request originalRequest = chain.request();
                        Request newRequest = originalRequest.newBuilder()
                                .header("Authorization", "Bearer " + accessToken)
                                .build();
                        return chain.proceed(newRequest);
                    })
                    .build();
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate - okHttpClient");
// Retrofit 인스턴스 생성
            retrofit = new Retrofit.Builder()
                    .baseUrl("https://k9b208.p.ssafy.io/api/v1/attendance/")
                    .client(okHttpClient)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate - retrofit");
            service = retrofit.create(AttendanceApiService.class);
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onCreate - Retrofit build successful");
        } catch (Exception e) {
            Log.e("DDDDDDDDDD", "UpdateWidgetService - onCreate - Retrofit build failed", e);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("DDDDDDDDDD", "Service started with ID: " + startId);
        // 항상 super의 onStartCommand를 호출하여 intent가 onHandleIntent로 전달되도록 합니다.
        return super.onStartCommand(intent, flags, startId);
    }


    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent");
        // Retrofit 호출과 위젯 업데이트 처리
        try {
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent response");
            Response<AttendanceResponse> response = service.getAttendanceDates().execute();
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent service"+response.message());
            Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent service"+(response.body().getData().getAttendances()));
            if (response.isSuccessful() && response.body() != null) {
                Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent isSuccessful");
                String[] attendances = response.body().getData().getAttendances();
                Log.d("DDDDDDDDDD", "UpdateWidgetService - onHandleIntent attendances" + Arrays.toString(attendances));

                // 위젯 업데이트 로직을 브로드캐스트를 통해 처리
                if (attendances != null) {
                    Intent updateIntent = new Intent(this, CalendarWidget.class);
                    updateIntent.setAction(CalendarWidget.DATA_FETCH_ACTION);
                    updateIntent.putExtra(CalendarWidget.EXTRA_ITEM, attendances);
                    sendBroadcast(updateIntent);
                }
            } else {
                Log.d("DDDDDDDDDD", "UpdateWidgetService - wrong response");
            }
        } catch (IOException e) {
            // Handle the IOException
            e.printStackTrace();
            // Log or handle the exception here
        }
    }

}