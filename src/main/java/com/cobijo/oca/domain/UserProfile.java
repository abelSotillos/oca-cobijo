package com.cobijo.oca.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userProfile")
    @JsonIgnoreProperties(value = { "game", "userProfile" }, allowSetters = true)
    private Set<PlayerGame> playerGames = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "userProfiles")
    @JsonIgnoreProperties(value = { "playerGames", "userProfiles" }, allowSetters = true)
    private Set<Game> games = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User user;

    @Column(name = "session_id")
    private String sessionId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNickname() {
        return this.nickname;
    }

    public UserProfile nickname(String nickname) {
        this.setNickname(nickname);
        return this;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatarUrl() {
        return this.avatarUrl;
    }

    public UserProfile avatarUrl(String avatarUrl) {
        this.setAvatarUrl(avatarUrl);
        return this;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Set<PlayerGame> getPlayerGames() {
        return this.playerGames;
    }

    public void setPlayerGames(Set<PlayerGame> playerGames) {
        if (this.playerGames != null) {
            this.playerGames.forEach(i -> i.setUserProfile(null));
        }
        if (playerGames != null) {
            playerGames.forEach(i -> i.setUserProfile(this));
        }
        this.playerGames = playerGames;
    }

    public UserProfile playerGames(Set<PlayerGame> playerGames) {
        this.setPlayerGames(playerGames);
        return this;
    }

    public UserProfile addPlayerGames(PlayerGame playerGame) {
        this.playerGames.add(playerGame);
        playerGame.setUserProfile(this);
        return this;
    }

    public UserProfile removePlayerGames(PlayerGame playerGame) {
        this.playerGames.remove(playerGame);
        playerGame.setUserProfile(null);
        return this;
    }

    public Set<Game> getGames() {
        return this.games;
    }

    public void setGames(Set<Game> games) {
        if (this.games != null) {
            this.games.forEach(i -> i.removeUserProfiles(this));
        }
        if (games != null) {
            games.forEach(i -> i.addUserProfiles(this));
        }
        this.games = games;
    }

    public UserProfile games(Set<Game> games) {
        this.setGames(games);
        return this;
    }

    public UserProfile addGames(Game game) {
        this.games.add(game);
        game.getUserProfiles().add(this);
        return this;
    }

    public UserProfile removeGames(Game game) {
        this.games.remove(game);
        game.getUserProfiles().remove(this);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserProfile user(User user) {
        this.setUser(user);
        return this;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public UserProfile sessionId(String sessionId) {
        this.setSessionId(sessionId);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return getId() != null && getId().equals(((UserProfile) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", nickname='" + getNickname() + "'" +
            ", avatarUrl='" + getAvatarUrl() + "'" +
            ", sessionId='" + getSessionId() + "'" +
            "}";
    }
}
