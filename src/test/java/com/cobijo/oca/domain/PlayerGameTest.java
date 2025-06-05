package com.cobijo.oca.domain;

import static com.cobijo.oca.domain.GameTestSamples.*;
import static com.cobijo.oca.domain.PlayerGameTestSamples.*;
import static com.cobijo.oca.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.cobijo.oca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlayerGameTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlayerGame.class);
        PlayerGame playerGame1 = getPlayerGameSample1();
        PlayerGame playerGame2 = new PlayerGame();
        assertThat(playerGame1).isNotEqualTo(playerGame2);

        playerGame2.setId(playerGame1.getId());
        assertThat(playerGame1).isEqualTo(playerGame2);

        playerGame2 = getPlayerGameSample2();
        assertThat(playerGame1).isNotEqualTo(playerGame2);
    }

    @Test
    void gameTest() {
        PlayerGame playerGame = getPlayerGameRandomSampleGenerator();
        Game gameBack = getGameRandomSampleGenerator();

        playerGame.setGame(gameBack);
        assertThat(playerGame.getGame()).isEqualTo(gameBack);

        playerGame.game(null);
        assertThat(playerGame.getGame()).isNull();
    }

    @Test
    void userProfileTest() {
        PlayerGame playerGame = getPlayerGameRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        playerGame.setUserProfile(userProfileBack);
        assertThat(playerGame.getUserProfile()).isEqualTo(userProfileBack);

        playerGame.userProfile(null);
        assertThat(playerGame.getUserProfile()).isNull();
    }
}
