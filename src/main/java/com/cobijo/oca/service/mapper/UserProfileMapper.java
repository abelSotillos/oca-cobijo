package com.cobijo.oca.service.mapper;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.User;
import com.cobijo.oca.domain.UserProfile;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.service.dto.UserDTO;
import com.cobijo.oca.service.dto.UserProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserProfile} and its DTO {@link UserProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserProfileMapper extends EntityMapper<UserProfileDTO, UserProfile> {
    @Mapping(target = "games", source = "games", qualifiedByName = "gameIdSet")
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    UserProfileDTO toDto(UserProfile s);

    @Mapping(target = "games", ignore = true)
    @Mapping(target = "removeGames", ignore = true)
    UserProfile toEntity(UserProfileDTO userProfileDTO);

    @Named("gameId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GameDTO toDtoGameId(Game game);

    @Named("gameIdSet")
    default Set<GameDTO> toDtoGameIdSet(Set<Game> game) {
        return game.stream().map(this::toDtoGameId).collect(Collectors.toSet());
    }

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
