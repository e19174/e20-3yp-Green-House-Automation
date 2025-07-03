package com.Green_Tech.Green_Tech.Controller;

import java.util.concurrent.ExecutionException;

import com.Green_Tech.Green_Tech.Entity.Notifications;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.*;

@Service
public class NotificationsRestController {

    public String sendMessage(Notifications request) throws InterruptedException, ExecutionException {

        Message message = getPreconfiguredMessageToTopic(request);
        return sendAndGetResponse(message);

    }

    private Message getPreconfiguredMessageToTopic(Notifications request) {

        return Message.builder()
                .setTopic(request.getTopic())
                .setNotification(Notification.builder()
                        .setTitle(request.getTitle())
                        .setBody(request.getMessage())
                        .build())
                .build();

    }

    public String sendMessageToSpecificDevice(String deviceToken, Notifications request) throws InterruptedException, ExecutionException {
        Message message = getPreConfiguredMessageToDevice(deviceToken, request);

        return sendAndGetResponse(message);
    }

    private Message getPreConfiguredMessageToDevice(String deviceToken, Notifications request) {
        return Message.builder()
                .setToken(deviceToken)
                .setNotification(Notification.builder()
                        .setTitle(request.getTitle())
                        .setBody(request.getMessage())
                        .build())
                .build();
    }

    private String sendAndGetResponse(Message message) throws InterruptedException, ExecutionException  {
        return FirebaseMessaging.getInstance().sendAsync(message).get();
    }
}
