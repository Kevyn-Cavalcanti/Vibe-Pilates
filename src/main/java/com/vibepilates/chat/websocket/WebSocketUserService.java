package com.vibepilates.chat.websocket;


import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class WebSocketUserService {
    private final Set<String> connectedUsers = ConcurrentHashMap.newKeySet();

    public void addUser(String username) {
        connectedUsers.add(username);
    }

    public void removeUser(String username) {
        connectedUsers.remove(username);
    }

    public Set<String> getAllUsers() {
        return connectedUsers;
    }
}
