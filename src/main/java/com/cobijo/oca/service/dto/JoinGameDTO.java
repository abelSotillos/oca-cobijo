package com.cobijo.oca.service.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO used to join a game.
 */
public class JoinGameDTO {

    @NotNull
    private Long gameId;

    @NotNull
    private Long userProfileId;

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getUserProfileId() {
        return userProfileId;
    }

    public void setUserProfileId(Long userProfileId) {
        this.userProfileId = userProfileId;
    }
}
