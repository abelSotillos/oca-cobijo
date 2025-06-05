package com.cobijo.oca.domain;

import static com.cobijo.oca.domain.GameTestSamples.*;
import static com.cobijo.oca.domain.PlayerGameTestSamples.*;
import static com.cobijo.oca.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.cobijo.oca.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GameTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Game.class);
        Game game1 = getGameSample1();
        Game game2 = new Game();
        assertThat(game1).isNotEqualTo(game2);

        game2.setId(game1.getId());
        assertThat(game1).isEqualTo(game2);

        game2 = getGameSample2();
        assertThat(game1).isNotEqualTo(game2);
    }

    @Test
    void playerGamesTest() {
        Game game = getGameRandomSampleGenerator();
        PlayerGame playerGameBack = getPlayerGameRandomSampleGenerator();

        game.addPlayerGames(playerGameBack);
        assertThat(game.getPlayerGames()).containsOnly(playerGameBack);
        assertThat(playerGameBack.getGame()).isEqualTo(game);

        game.removePlayerGames(playerGameBack);
        assertThat(game.getPlayerGames()).doesNotContain(playerGameBack);
        assertThat(playerGameBack.getGame()).isNull();

        game.playerGames(new HashSet<>(Set.of(playerGameBack)));
        assertThat(game.getPlayerGames()).containsOnly(playerGameBack);
        assertThat(playerGameBack.getGame()).isEqualTo(game);

        game.setPlayerGames(new HashSet<>());
        assertThat(game.getPlayerGames()).doesNotContain(playerGameBack);
        assertThat(playerGameBack.getGame()).isNull();
    }

    @Test
    void userProfilesTest() {
        Game game = getGameRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        game.addUserProfiles(userProfileBack);
        assertThat(game.getUserProfiles()).containsOnly(userProfileBack);

        game.removeUserProfiles(userProfileBack);
        assertThat(game.getUserProfiles()).doesNotContain(userProfileBack);

        game.userProfiles(new HashSet<>(Set.of(userProfileBack)));
        assertThat(game.getUserProfiles()).containsOnly(userProfileBack);

        game.setUserProfiles(new HashSet<>());
        assertThat(game.getUserProfiles()).doesNotContain(userProfileBack);
    }
}
