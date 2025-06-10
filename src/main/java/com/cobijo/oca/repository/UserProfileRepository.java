package com.cobijo.oca.repository;

import com.cobijo.oca.domain.UserProfile;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    java.util.Optional<UserProfile> findOneBySessionId(String sessionId);
    java.util.Optional<UserProfile> findOneByUser_Login(String login);
}
