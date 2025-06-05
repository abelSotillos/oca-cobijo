package com.cobijo.oca.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.cobijo.oca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlayerGameDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlayerGameDTO.class);
        PlayerGameDTO playerGameDTO1 = new PlayerGameDTO();
        playerGameDTO1.setId(1L);
        PlayerGameDTO playerGameDTO2 = new PlayerGameDTO();
        assertThat(playerGameDTO1).isNotEqualTo(playerGameDTO2);
        playerGameDTO2.setId(playerGameDTO1.getId());
        assertThat(playerGameDTO1).isEqualTo(playerGameDTO2);
        playerGameDTO2.setId(2L);
        assertThat(playerGameDTO1).isNotEqualTo(playerGameDTO2);
        playerGameDTO1.setId(null);
        assertThat(playerGameDTO1).isNotEqualTo(playerGameDTO2);
    }
}
