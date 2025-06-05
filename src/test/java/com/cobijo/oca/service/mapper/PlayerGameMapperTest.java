package com.cobijo.oca.service.mapper;

import static com.cobijo.oca.domain.PlayerGameAsserts.*;
import static com.cobijo.oca.domain.PlayerGameTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlayerGameMapperTest {

    private PlayerGameMapper playerGameMapper;

    @BeforeEach
    void setUp() {
        playerGameMapper = new PlayerGameMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPlayerGameSample1();
        var actual = playerGameMapper.toEntity(playerGameMapper.toDto(expected));
        assertPlayerGameAllPropertiesEquals(expected, actual);
    }
}
