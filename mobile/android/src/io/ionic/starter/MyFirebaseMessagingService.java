/*
package io.ionic.starter;

*/
/**
 * Created by Rohit on 1/9/2018.
 *//*


import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.firebase.jobdispatcher.FirebaseJobDispatcher;
import com.firebase.jobdispatcher.GooglePlayDriver;
import com.firebase.jobdispatcher.Job;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import model.ActiveContact;
import model.Appointment;
import utils.FirebaseUtil;
import utils.Utility;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";
    private String showcanceled;
    private String state;

    */
/**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     *//*

    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // [START_EXCLUDE]
        // There are two types of messages data messages and notification messages. Data messages are handled
        // here in onMessageReceived whether the app is in the foreground or background. Data messages are the type
        // traditionally used with GCM. Notification messages are only received here in onMessageReceived when the app
        // is in the foreground. When the app is in the background an automatically generated notification is displayed.
        // When the user taps on the notification they are returned to the app. Messages containing both notification
        // and data payloads are treated as notification messages. The Firebase console always sends notification
        // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options
        // [END_EXCLUDE]

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());

            if (*/
/* Check if data needs to be processed by long running job *//*
 true) {
                // For long-running tasks (10 seconds or more) use Firebase Job Dispatcher.
                scheduleJob();
            } else {
                // Handle message within 10 seconds
                handleNow();
            }

        }

        // Check if message contains a notification payload.
        */
/*if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
            sendNotification(remoteMessage.getNotification());
        }*//*

        sendNotification(remoteMessage.getData());

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
    // [END receive_message]

    */
/**
     * Schedule a job using FirebaseJobDispatcher.
     *//*

    private void scheduleJob() {
        // [START dispatch_job]
        FirebaseJobDispatcher dispatcher = new FirebaseJobDispatcher(new GooglePlayDriver(this));
        Job myJob = dispatcher.newJobBuilder().setService(MyJobService.class).setTag("my-job-tag").build();
        dispatcher.schedule(myJob);
        // [END dispatch_job]
    }

    */
/**
     * Handle time allotted to BroadcastReceivers.
     *//*

    private void handleNow() {
        Log.d(TAG, "Short lived task is done.");
    }

    */
/**
     * Create and show a simple notification containing the received FCM message.
     *
     * @param
     *//*

    private void sendNotification(Map<String, String> data) {

        String channelId = getString(R.string.app_name);
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        //Appointment appointment = new Gson().fromJson(notification.getBody(), Appointment.class);
        String title = "Test", message = "";
        title = "New Appointment";
        message = "New appointment booked for you!";
        */
/*if(title != null && title.equals("NEW_APP")) {

        }*//*


        String name = data.get("name") != null ? data.get("name") : "";
        String date = data.get("date");
        String startTime = data.get("startTime");
        String endTime = data.get("endTime");
        String type = data.get("type");
        String appointmentId = data.get("appointmentId");
        String description=data.get("description");






        if (appointmentId == null || type == null) {
            return;
        }

        String time = date + " " + startTime;
        System.out.println("Notification received from =>" + name+description);
        final Appointment appointment = new Appointment();

        Intent intent = new Intent(this, AppointmentsActivity.class);
        Bundle b = new Bundle();
        if (Utility.NOTIFICATION_TYPE_NEW.equals(type)) {
            title = "New appointment";
            message = "Appointment booked for you by " + name + " starting at " + time;
            appointment.setStartTime(startTime);
            appointment.setEndTime(endTime);
            appointment.setName(name);
           //appointment.setContactList((List<ActiveContact>) data.get("contactList"));
            appointment.setDescription(description);
            appointment.setId(appointmentId);
            appointment.setDate(date);
            Utility.addAppointmentsToCalender(getApplicationContext(), appointment);
           */
/* b.putBoolean("showcanceled",false);
            b.putInt("state",1);*//*

            showcanceled = "false";
            state = "1";
           // System.out.println("Receive notification "+appointment.getContactList().get(0).getContact());
        } else if (Utility.NOTIFICATION_TYPE_CANCEL.equals(type)) {
            title = "Appointment cancelled";
            message = "Your appointment starting at " + time + " is cancelled by " + name;
            showcanceled = "true";
            state = "2";

            appointment.setId(appointmentId);
            String userPhone = FirebaseUtil.getMobile();
            final List<Map<String, String>> totalmemberlist = new ArrayList<>();

            FirebaseUtil.db.collection(FirebaseUtil.DOC_USERS).document(userPhone).collection(FirebaseUtil.DOC_APPOINTMENTS).document(appointmentId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {

                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {

                    Appointment currentUser = new Appointment();
                    if (task.getResult().getString("name") != null) {
                        currentUser.setName(task.getResult().getString("name"));
                    }
                    if (task.getResult().getString("startTime") != null) {
                        currentUser.setStartTime(task.getResult().getString("startTime"));
                    }
                    if (task.getResult().getString("endTime") != null) {
                        currentUser.setEndTime(task.getResult().getString("endTime"));
                    }

                    if (task.getResult().getString("description") != null) {
                        currentUser.setDescription(task.getResult().getString("description"));
                    }
                    if (task.getResult().getString("date") != null) {
                        currentUser.setDate(task.getResult().getString("date"));
                    }
                    if (task.getResult().getString("appointmentStatus") != null) {
                        currentUser.setAppointmentStatus(task.getResult().getString("appointmentStatus"));
                    }
                    if (task.getResult().get("contactList") != null) {
                        currentUser.setContactList((List<ActiveContact>) task.getResult().getData().get("contactList"));
                    }

                    for (int i = 0; i < currentUser.getContactList().size(); i++) {
                        Map<String, String> contacts = (Map<String, String>) currentUser.getContactList().get(i);
                        System.out.println("Appointment status " + contacts.get("status"));
                        if (contacts.get("status").equals(Utility.APP_STATUS_ACTIVE)) {
                            System.out.println("Other memeber " + contacts.get("number"));
                            totalmemberlist.add(contacts);

                        }

                    }

                    DeleteCalenderEvent(totalmemberlist,appointment);
                }
            });


        }


        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("states", state);
        intent.putExtra("showcancel", showcanceled);
        System.out.println("Show cancel in firebase " + showcanceled + " staes in firebase " + state);

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 */
/* Request code *//*
, intent, PendingIntent.FLAG_ONE_SHOT);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelId).setSmallIcon(R.mipmap.timede).setContentTitle(title).setContentText(message).setAutoCancel(true).setSound(defaultSoundUri).setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 */
/* ID of notification *//*
, notificationBuilder.build());
    }

    private void DeleteCalenderEvent(List<Map<String, String>> totalmemberlist,Appointment appointment) {
        System.out.println("Size of totalmember "+totalmemberlist.size());
        if(totalmemberlist.size()==0){
            Utility.deleteAppointmentFromCalendar(getApplicationContext(), appointment);
            System.out.println("Appointment Deleted!!");
        }
    }

    private static final String APP_KEY = "key=AAAACMqZO2Y:APA91bFvKzS7o72_2hf-zA5jqc9hKfCUQcT-qvo_p3lsrKNGYrN6QmLKWdbqe48dwoSD53kn7Q2d-jnlDvjtZyM57vmgkU1vI_ZERkkkEVpZzDm3VzgunyGzPDa1pB1LbD0AGGBFdgNA";
    private static final String POST_URL = "https://fcm.googleapis.com/fcm/send";
    private static final String POST_PARAMS = "{ \"data\": { \"title\": \"{message}\", \"detail\": \"{description}\"}, \"to\" : \"{regId}\"}";


}*/
