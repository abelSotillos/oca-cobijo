package com.cobijo.oca.web.websocket;

import com.cobijo.oca.service.dto.GameDTO;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class GameWebsocketService {

    private final SimpMessageSendingOperations messagingTemplate;

    public GameWebsocketService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendGameUpdate(GameDTO gameDTO) {
        messagingTemplate.convertAndSend("/topic/games", gameDTO);
    }
}
