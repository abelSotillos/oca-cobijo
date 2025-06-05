package com.cobijo.oca.domain;

import static com.cobijo.oca.domain.GameTestSamples.*;
import static com.cobijo.oca.domain.PlayerGameTestSamples.*;
import static com.cobijo.oca.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.cobijo.oca.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UserProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserProfile.class);
        UserProfile userProfile1 = getUserProfileSample1();
        UserProfile userProfile2 = new UserProfile();
        assertThat(userProfile1).isNotEqualTo(userProfile2);

        userProfile2.setId(userProfile1.getId());
        assertThat(userProfile1).isEqualTo(userProfile2);

        userProfile2 = getUserProfileSample2();
        assertThat(userProfile1).isNotEqualTo(userProfile2);
    }

    @Test
    void playerGamesTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        PlayerGame playerGameBack = getPlayerGameRandomSampleGenerator();

        userProfile.addPlayerGames(playerGameBack);
        assertThat(userProfile.getPlayerGames()).containsOnly(playerGameBack);
        assertThat(playerGameBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.removePlayerGames(playerGameBack);
        assertThat(userProfile.getPlayerGames()).doesNotContain(playerGameBack);
        assertThat(playerGameBack.getUserProfile()).isNull();

        userProfile.playerGames(new HashSet<>(Set.of(playerGameBack)));
        assertThat(userProfile.getPlayerGames()).containsOnly(playerGameBack);
        assertThat(playerGameBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.setPlayerGames(new HashSet<>());
        assertThat(userProfile.getPlayerGames()).doesNotContain(playerGameBack);
        assertThat(playerGameBack.getUserProfile()).isNull();
    }

    @Test
    void gamesTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        Game gameBack = getGameRandomSampleGenerator();

        userProfile.addGames(gameBack);
        assertThat(userProfile.getGames()).containsOnly(gameBack);
        assertThat(gameBack.getUserProfiles()).containsOnly(userProfile);

        userProfile.removeGames(gameBack);
        assertThat(userProfile.getGames()).doesNotContain(gameBack);
        assertThat(gameBack.getUserProfiles()).doesNotContain(userProfile);

        userProfile.games(new HashSet<>(Set.of(gameBack)));
        assertThat(userProfile.getGames()).containsOnly(gameBack);
        assertThat(gameBack.getUserProfiles()).containsOnly(userProfile);

        userProfile.setGames(new HashSet<>());
        assertThat(userProfile.getGames()).doesNotContain(gameBack);
        assertThat(gameBack.getUserProfiles()).doesNotContain(userProfile);
    }
}
