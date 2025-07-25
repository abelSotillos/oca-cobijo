package com.cobijo.oca.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A PlayerGame.
 */
@Entity
@Table(name = "player_game")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PlayerGame implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "position", nullable = false)
    private Integer position;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @Column(name = "is_winner")
    private Boolean isWinner;

    @Column(name = "blocked_turns")
    private Integer blockedTurns;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "playerGames", "userProfiles" }, allowSetters = true)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "playerGames", "games", "user" }, allowSetters = true)
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PlayerGame id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosition() {
        return this.position;
    }

    public PlayerGame position(Integer position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Integer getOrder() {
        return this.order;
    }

    public PlayerGame order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Boolean getIsWinner() {
        return this.isWinner;
    }

    public PlayerGame isWinner(Boolean isWinner) {
        this.setIsWinner(isWinner);
        return this;
    }

    public void setIsWinner(Boolean isWinner) {
        this.isWinner = isWinner;
    }

    public Integer getBlockedTurns() {
        return this.blockedTurns;
    }

    public PlayerGame blockedTurns(Integer blockedTurns) {
        this.setBlockedTurns(blockedTurns);
        return this;
    }

    public void setBlockedTurns(Integer blockedTurns) {
        this.blockedTurns = blockedTurns;
    }

    public Game getGame() {
        return this.game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public PlayerGame game(Game game) {
        this.setGame(game);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public PlayerGame userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlayerGame)) {
            return false;
        }
        return getId() != null && getId().equals(((PlayerGame) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PlayerGame{" +
            "id=" + getId() +
            ", position=" + getPosition() +
            ", order=" + getOrder() +
            ", isWinner='" + getIsWinner() + "'" +
            ", blockedTurns=" + getBlockedTurns() +
            "}";
    }
}
