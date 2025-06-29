package com.cobijo.oca.service;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.enumeration.GameStatus;
import com.cobijo.oca.repository.GameRepository;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.service.mapper.GameMapper;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.cobijo.oca.domain.Game}.
 */
@Service
@Transactional
public class GameService {

    private static final Logger LOG = LoggerFactory.getLogger(GameService.class);

    private final GameRepository gameRepository;

    private final GameMapper gameMapper;

    public GameService(GameRepository gameRepository, GameMapper gameMapper) {
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
    }

    /**
     * Save a game.
     *
     * @param gameDTO the entity to save.
     * @return the persisted entity.
     */
    public GameDTO save(GameDTO gameDTO) {
        LOG.debug("Request to save Game : {}", gameDTO);
        Game game = gameMapper.toEntity(gameDTO);
        game = gameRepository.save(game);
        return gameMapper.toDto(game);
    }

    /**
     * Update a game.
     *
     * @param gameDTO the entity to save.
     * @return the persisted entity.
     */
    public GameDTO update(GameDTO gameDTO) {
        LOG.debug("Request to update Game : {}", gameDTO);
        Game game = gameMapper.toEntity(gameDTO);
        game = gameRepository.save(game);
        return gameMapper.toDto(game);
    }

    public GameDTO createRoom() {
        Game game = new Game();
        game.setCode(RandomStringUtils.randomAlphanumeric(6));
        game.setStatus(GameStatus.WAITING);
        game = gameRepository.save(game);
        return gameMapper.toDto(game);
    }

    public GameDTO startGame(Long id) {
        LOG.debug("Request to start Game : {}", id);
        Game game = gameRepository.findById(id).orElseThrow();
        game.setStatus(GameStatus.IN_PROGRESS);
        game = gameRepository.save(game);
        return gameMapper.toDto(game);
    }

    /**
     * Partially update a game.
     *
     * @param gameDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GameDTO> partialUpdate(GameDTO gameDTO) {
        LOG.debug("Request to partially update Game : {}", gameDTO);

        return gameRepository
            .findById(gameDTO.getId())
            .map(existingGame -> {
                gameMapper.partialUpdate(existingGame, gameDTO);

                return existingGame;
            })
            .map(gameRepository::save)
            .map(gameMapper::toDto);
    }

    /**
     * Get all the games.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<GameDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Games");
        return gameRepository.findAll(pageable).map(gameMapper::toDto);
    }

    /**
     * Get all the games with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<GameDTO> findAllWithEagerRelationships(Pageable pageable) {
        return gameRepository.findAllWithEagerRelationships(pageable).map(gameMapper::toDto);
    }

    /**
     * Get one game by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GameDTO> findOne(Long id) {
        LOG.debug("Request to get Game : {}", id);
        return gameRepository.findOneWithEagerRelationships(id).map(gameMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<GameDTO> findOneByCode(String code) {
        LOG.debug("Request to get Game by code : {}", code);
        return gameRepository.findOneWithEagerRelationshipsByCode(code).map(gameMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<GameDTO> findActiveByUser(Long userId) {
        LOG.debug("Request to get active games for user : {}", userId);
        List<Game> games = gameRepository.findByUserAndStatuses(userId, List.of(GameStatus.WAITING, GameStatus.IN_PROGRESS));
        return games.stream().map(gameMapper::toDto).toList();
    }

    /**
     * Delete the game by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Game : {}", id);
        gameRepository.deleteById(id);
    }
}
