package com.cobijo.oca.repository;

import com.cobijo.oca.domain.PlayerGame;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PlayerGame entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlayerGameRepository extends JpaRepository<PlayerGame, Long> {
    List<PlayerGame> findByGameId(Long gameId);
}
