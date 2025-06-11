package com.cobijo.oca.repository;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.enumeration.GameStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Game entity.
 *
 * When extending this class, extend GameRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface GameRepository extends GameRepositoryWithBagRelationships, JpaRepository<Game, Long> {
    default Optional<Game> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Game> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Game> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    Optional<Game> findOneByCode(String code);

    default Optional<Game> findOneWithEagerRelationshipsByCode(String code) {
        return this.fetchBagRelationships(this.findOneByCode(code));
    }

    @Query("select distinct g from Game g left join fetch g.userProfiles u where u.id = :userId and g.status in :statuses")
    List<Game> findByUserAndStatuses(@Param("userId") Long userId, @Param("statuses") List<GameStatus> statuses);
}
