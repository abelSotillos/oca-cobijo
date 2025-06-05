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
    @Column(name = "positionx", nullable = false)
    private Integer positionx;

    @NotNull
    @Column(name = "positiony", nullable = false)
    private Integer positiony;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @Column(name = "is_winner")
    private Boolean isWinner;

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

    public Integer getPositionx() {
        return this.positionx;
    }

    public PlayerGame positionx(Integer positionx) {
        this.setPositionx(positionx);
        return this;
    }

    public void setPositionx(Integer positionx) {
        this.positionx = positionx;
    }

    public Integer getPositiony() {
        return this.positiony;
    }

    public PlayerGame positiony(Integer positiony) {
        this.setPositiony(positiony);
        return this;
    }

    public void setPositiony(Integer positiony) {
        this.positiony = positiony;
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
            ", positionx=" + getPositionx() +
            ", positiony=" + getPositiony() +
            ", order=" + getOrder() +
            ", isWinner='" + getIsWinner() + "'" +
            "}";
    }
}
