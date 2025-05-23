package com.vibepilates.controller;

import com.vibepilates.model.ChatMessage;
import com.vibepilates.service.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public ChatController(SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage,
                        SimpMessageHeaderAccessor headerAccessor) {

        String username = chatMessage.getSender();
        System.out.println("🟢 [addUser] Usuário conectado: " + username);

        if (username != null && !username.isBlank()) {
            userService.addUser(username);
            headerAccessor.getSessionAttributes().put("username", username);

            messagingTemplate.convertAndSend("/topic/users", userService.getAllUsers());

            messagingTemplate.convertAndSendToUser(
                username,
                "/queue/users",
                userService.getAllUsers()
            );
        }
    }
    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(@Payload ChatMessage message) {
        String sender = message.getSender();
        String recipient = message.getRecipient();
        String content = message.getContent();

        String roomId = Stream.of(sender, recipient).sorted().collect(Collectors.joining("-"));

        System.out.println("✉️ [Sala: " + roomId + "] " + sender + " ➜ " + recipient + ": " + content);

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
    }
}
