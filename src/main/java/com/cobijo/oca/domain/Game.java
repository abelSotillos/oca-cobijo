package com.cobijo.oca.domain;

import com.cobijo.oca.domain.enumeration.GameStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Game.
 */
@Entity
@Table(name = "game")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Game implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GameStatus status;

    @Column(name = "current_turn")
    private Integer currentTurn;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "game")
    @JsonIgnoreProperties(value = { "game", "userProfile" }, allowSetters = true)
    private Set<PlayerGame> playerGames = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_game__user_profiles",
        joinColumns = @JoinColumn(name = "game_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profiles_id")
    )
    @JsonIgnoreProperties(value = { "playerGames", "games", "user" }, allowSetters = true)
    private Set<UserProfile> userProfiles = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Game id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Game code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public GameStatus getStatus() {
        return this.status;
    }

    public Game status(GameStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public Integer getCurrentTurn() {
        return this.currentTurn;
    }

    public Game currentTurn(Integer currentTurn) {
        this.setCurrentTurn(currentTurn);
        return this;
    }

    public void setCurrentTurn(Integer currentTurn) {
        this.currentTurn = currentTurn;
    }

    public Set<PlayerGame> getPlayerGames() {
        return this.playerGames;
    }

    public void setPlayerGames(Set<PlayerGame> playerGames) {
        if (this.playerGames != null) {
            this.playerGames.forEach(i -> i.setGame(null));
        }
        if (playerGames != null) {
            playerGames.forEach(i -> i.setGame(this));
        }
        this.playerGames = playerGames;
    }

    public Game playerGames(Set<PlayerGame> playerGames) {
        this.setPlayerGames(playerGames);
        return this;
    }

    public Game addPlayerGames(PlayerGame playerGame) {
        this.playerGames.add(playerGame);
        playerGame.setGame(this);
        return this;
    }

    public Game removePlayerGames(PlayerGame playerGame) {
        this.playerGames.remove(playerGame);
        playerGame.setGame(null);
        return this;
    }

    public Set<UserProfile> getUserProfiles() {
        return this.userProfiles;
    }

    public void setUserProfiles(Set<UserProfile> userProfiles) {
        this.userProfiles = userProfiles;
    }

    public Game userProfiles(Set<UserProfile> userProfiles) {
        this.setUserProfiles(userProfiles);
        return this;
    }

    public Game addUserProfiles(UserProfile userProfile) {
        this.userProfiles.add(userProfile);
        return this;
    }

    public Game removeUserProfiles(UserProfile userProfile) {
        this.userProfiles.remove(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Game)) {
            return false;
        }
        return getId() != null && getId().equals(((Game) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Game{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", status='" + getStatus() + "'" +
            ", currentTurn=" + getCurrentTurn() +
            "}";
    }
}
