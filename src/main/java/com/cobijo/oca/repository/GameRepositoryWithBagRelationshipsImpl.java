package com.cobijo.oca.repository;

import com.cobijo.oca.domain.Game;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class GameRepositoryWithBagRelationshipsImpl implements GameRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String GAMES_PARAMETER = "games";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Game> fetchBagRelationships(Optional<Game> game) {
        return game.map(this::fetchUserProfiles);
    }

    @Override
    public Page<Game> fetchBagRelationships(Page<Game> games) {
        return new PageImpl<>(fetchBagRelationships(games.getContent()), games.getPageable(), games.getTotalElements());
    }

    @Override
    public List<Game> fetchBagRelationships(List<Game> games) {
        return Optional.of(games).map(this::fetchUserProfiles).orElse(Collections.emptyList());
    }

    Game fetchUserProfiles(Game result) {
        return entityManager
            .createQuery("select game from Game game left join fetch game.userProfiles where game.id = :id", Game.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Game> fetchUserProfiles(List<Game> games) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, games.size()).forEach(index -> order.put(games.get(index).getId(), index));
        List<Game> result = entityManager
            .createQuery("select game from Game game left join fetch game.userProfiles where game in :games", Game.class)
            .setParameter(GAMES_PARAMETER, games)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
