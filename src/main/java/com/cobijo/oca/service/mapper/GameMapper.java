package com.cobijo.oca.service.mapper;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.UserProfile;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.service.dto.UserProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Game} and its DTO {@link GameDTO}.
 */
@Mapper(componentModel = "spring")
public interface GameMapper extends EntityMapper<GameDTO, Game> {
    @Mapping(target = "userProfiles", source = "userProfiles", qualifiedByName = "userProfileIdSet")
    GameDTO toDto(Game s);

    @Mapping(target = "removeUserProfiles", ignore = true)
    Game toEntity(GameDTO gameDTO);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);

    @Named("userProfileIdSet")
    default Set<UserProfileDTO> toDtoUserProfileIdSet(Set<UserProfile> userProfile) {
        return userProfile.stream().map(this::toDtoUserProfileId).collect(Collectors.toSet());
    }
}
