package com.cobijo.oca.service.mapper;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.PlayerGame;
import com.cobijo.oca.domain.UserProfile;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.service.dto.PlayerGameDTO;
import com.cobijo.oca.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PlayerGame} and its DTO {@link PlayerGameDTO}.
 */
@Mapper(componentModel = "spring")
public interface PlayerGameMapper extends EntityMapper<PlayerGameDTO, PlayerGame> {
    @Mapping(target = "game", source = "game", qualifiedByName = "gameId")
    @Mapping(target = "userProfile", source = "userProfile", qualifiedByName = "userProfileId")
    PlayerGameDTO toDto(PlayerGame s);

    @Named("gameId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GameDTO toDtoGameId(Game game);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);
}
