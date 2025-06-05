package com.cobijo.oca.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.cobijo.oca.domain.PlayerGame} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PlayerGameDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer positionx;

    @NotNull
    private Integer positiony;

    @NotNull
    private Integer order;

    private Boolean isWinner;

    private GameDTO game;

    private UserProfileDTO userProfile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPositionx() {
        return positionx;
    }

    public void setPositionx(Integer positionx) {
        this.positionx = positionx;
    }

    public Integer getPositiony() {
        return positiony;
    }

    public void setPositiony(Integer positiony) {
        this.positiony = positiony;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Boolean getIsWinner() {
        return isWinner;
    }

    public void setIsWinner(Boolean isWinner) {
        this.isWinner = isWinner;
    }

    public GameDTO getGame() {
        return game;
    }

    public void setGame(GameDTO game) {
        this.game = game;
    }

    public UserProfileDTO getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfileDTO userProfile) {
        this.userProfile = userProfile;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlayerGameDTO)) {
            return false;
        }

        PlayerGameDTO playerGameDTO = (PlayerGameDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, playerGameDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PlayerGameDTO{" +
            "id=" + getId() +
            ", positionx=" + getPositionx() +
            ", positiony=" + getPositiony() +
            ", order=" + getOrder() +
            ", isWinner='" + getIsWinner() + "'" +
            ", game=" + getGame() +
            ", userProfile=" + getUserProfile() +
            "}";
    }
}
