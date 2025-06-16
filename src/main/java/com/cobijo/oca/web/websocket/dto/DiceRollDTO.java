package com.cobijo.oca.web.websocket.dto;

import com.cobijo.oca.service.dto.GameDTO;

/**
 * DTO representing a dice roll event.
 */
public class DiceRollDTO {

    private GameDTO game;

    private int dice;

    public DiceRollDTO() {}

    public DiceRollDTO(GameDTO game, int dice) {
        this.game = game;
        this.dice = dice;
    }

    public GameDTO getGame() {
        return game;
    }

    public void setGame(GameDTO game) {
        this.game = game;
    }

    public int getDice() {
        return dice;
    }

    public void setDice(int dice) {
        this.dice = dice;
    }
}
