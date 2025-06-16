package com.vibepilates.chat.websocket;


import com.vibepilates.chat.websocket.ChatSocketMessage;
import com.vibepilates.chat.websocket.WebSocketUserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final WebSocketUserService userService;

    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, WebSocketUserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatSocketMessage chatMessage,
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
    public void sendPrivateMessage(@Payload ChatSocketMessage message) {
        String sender = message.getSender();
        String recipient = message.getRecipient();
        String content = message.getContent();

        String roomId = Stream.of(sender, recipient).sorted().collect(Collectors.joining("-"));

        System.out.println("✉️ [Sala: " + roomId + "] " + sender + " ➜ " + recipient + ": " + content);

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
    }
}
