package com.cobijo.oca.repository;

import com.cobijo.oca.domain.Game;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface GameRepositoryWithBagRelationships {
    Optional<Game> fetchBagRelationships(Optional<Game> game);

    List<Game> fetchBagRelationships(List<Game> games);

    Page<Game> fetchBagRelationships(Page<Game> games);
}
