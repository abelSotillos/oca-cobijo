package com.cobijo.oca.service;

import com.cobijo.oca.domain.PlayerGame;
import com.cobijo.oca.repository.PlayerGameRepository;
import com.cobijo.oca.service.dto.PlayerGameDTO;
import com.cobijo.oca.service.mapper.PlayerGameMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.cobijo.oca.domain.PlayerGame}.
 */
@Service
@Transactional
public class PlayerGameService {

    private static final Logger LOG = LoggerFactory.getLogger(PlayerGameService.class);

    private final PlayerGameRepository playerGameRepository;

    private final PlayerGameMapper playerGameMapper;

    public PlayerGameService(PlayerGameRepository playerGameRepository, PlayerGameMapper playerGameMapper) {
        this.playerGameRepository = playerGameRepository;
        this.playerGameMapper = playerGameMapper;
    }

    /**
     * Save a playerGame.
     *
     * @param playerGameDTO the entity to save.
     * @return the persisted entity.
     */
    public PlayerGameDTO save(PlayerGameDTO playerGameDTO) {
        LOG.debug("Request to save PlayerGame : {}", playerGameDTO);
        PlayerGame playerGame = playerGameMapper.toEntity(playerGameDTO);
        playerGame = playerGameRepository.save(playerGame);
        return playerGameMapper.toDto(playerGame);
    }

    /**
     * Update a playerGame.
     *
     * @param playerGameDTO the entity to save.
     * @return the persisted entity.
     */
    public PlayerGameDTO update(PlayerGameDTO playerGameDTO) {
        LOG.debug("Request to update PlayerGame : {}", playerGameDTO);
        PlayerGame playerGame = playerGameMapper.toEntity(playerGameDTO);
        playerGame = playerGameRepository.save(playerGame);
        return playerGameMapper.toDto(playerGame);
    }

    /**
     * Partially update a playerGame.
     *
     * @param playerGameDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PlayerGameDTO> partialUpdate(PlayerGameDTO playerGameDTO) {
        LOG.debug("Request to partially update PlayerGame : {}", playerGameDTO);

        return playerGameRepository
            .findById(playerGameDTO.getId())
            .map(existingPlayerGame -> {
                playerGameMapper.partialUpdate(existingPlayerGame, playerGameDTO);

                return existingPlayerGame;
            })
            .map(playerGameRepository::save)
            .map(playerGameMapper::toDto);
    }

    /**
     * Get all the playerGames.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PlayerGameDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all PlayerGames");
        return playerGameRepository.findAll(pageable).map(playerGameMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PlayerGameDTO> findByGameId(Long gameId) {
        LOG.debug("Request to get PlayerGames by game : {}", gameId);
        return playerGameRepository
            .findByGameId(gameId)
            .stream()
            .map(playerGameMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get one playerGame by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PlayerGameDTO> findOne(Long id) {
        LOG.debug("Request to get PlayerGame : {}", id);
        return playerGameRepository.findById(id).map(playerGameMapper::toDto);
    }

    /**
     * Delete the playerGame by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete PlayerGame : {}", id);
        playerGameRepository.deleteById(id);
    }
}
