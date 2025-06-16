package com.cobijo.oca.web.websocket;

import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.web.websocket.dto.DiceRollDTO;
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

    public void sendDiceRoll(DiceRollDTO diceRollDTO) {
        messagingTemplate.convertAndSend("/topic/dice", diceRollDTO);
    }
}
