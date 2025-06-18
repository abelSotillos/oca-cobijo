package com.cobijo.oca.service;

import com.cobijo.oca.domain.Game;
import com.cobijo.oca.domain.PlayerGame;
import com.cobijo.oca.domain.UserProfile;
import com.cobijo.oca.domain.enumeration.GameStatus;
import com.cobijo.oca.repository.GameRepository;
import com.cobijo.oca.repository.PlayerGameRepository;
import com.cobijo.oca.repository.UserProfileRepository;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.service.dto.PlayerGameDTO;
import com.cobijo.oca.service.mapper.GameMapper;
import com.cobijo.oca.service.mapper.PlayerGameMapper;
import com.cobijo.oca.web.websocket.dto.DiceRollDTO;
import com.cobijo.oca.web.websocket.dto.DiceRollDTO;
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

    private final GameRepository gameRepository;

    private final UserProfileRepository userProfileRepository;

    private final PlayerGameMapper playerGameMapper;

    private final GameMapper gameMapper;

    public PlayerGameService(
        PlayerGameRepository playerGameRepository,
        GameRepository gameRepository,
        UserProfileRepository userProfileRepository,
        PlayerGameMapper playerGameMapper,
        GameMapper gameMapper
    ) {
        this.playerGameRepository = playerGameRepository;
        this.gameRepository = gameRepository;
        this.userProfileRepository = userProfileRepository;
        this.playerGameMapper = playerGameMapper;
        this.gameMapper = gameMapper;
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
        return playerGameRepository.findByGameIdOrderByOrder(gameId).stream().map(playerGameMapper::toDto).collect(Collectors.toList());
    }

    public PlayerGameDTO join(Long gameId, Long userProfileId) {
        LOG.debug("Request to join game {} with user {}", gameId, userProfileId);
        Game game = gameRepository.findById(gameId).orElseThrow();
        if (game.getStatus() != GameStatus.WAITING) {
            throw new IllegalStateException("Game already started");
        }
        Optional<PlayerGame> existing = playerGameRepository.findByGameIdAndUserProfileId(gameId, userProfileId);
        if (existing.isPresent()) {
            return playerGameMapper.toDto(existing.get());
        }
        UserProfile userProfile = userProfileRepository.findById(userProfileId).orElseThrow();
        PlayerGame pg = new PlayerGame();
        pg.setGame(game);
        pg.setUserProfile(userProfile);
        pg.setPosition(0);
        pg.setBlockedTurns(0);
        pg.setOrder(playerGameRepository.findByGameIdOrderByOrder(gameId).size());
        pg.setIsWinner(false);
        pg = playerGameRepository.save(pg);
        return playerGameMapper.toDto(pg);
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

    public DiceRollDTO rollDice(Long gameId) {
        LOG.debug("Request to roll dice for game : {}", gameId);
        Game game = gameRepository.findById(gameId).orElseThrow();
        List<PlayerGame> players = playerGameRepository.findByGameIdOrderByOrder(gameId);
        if (players.isEmpty()) {
            throw new IllegalStateException("No players in game");
        }

        int currentTurn = game.getCurrentTurn() == null ? 0 : game.getCurrentTurn();
        currentTurn = currentTurn % players.size();

        PlayerGame currentPlayer = players.get(currentTurn);

        if (currentPlayer.getBlockedTurns() != null && currentPlayer.getBlockedTurns() > 0) {
            currentPlayer.setBlockedTurns(currentPlayer.getBlockedTurns() - 1);
            playerGameRepository.save(currentPlayer);
            game.setCurrentTurn((currentTurn + 1) % players.size());
            game = gameRepository.save(game);
            return new DiceRollDTO(gameMapper.toDto(game), 0);
        }

        int dice = (int) (Math.random() * 6) + 1;
        int boardSize = 22;
        int finalIndex = boardSize - 1;
        int tentative = currentPlayer.getPosition() + dice;
        int newIndex;

        if (tentative == finalIndex) {
            currentPlayer.setIsWinner(true);
            newIndex = finalIndex;
        } else if (tentative > finalIndex) {
            int diff = tentative - finalIndex;
            newIndex = finalIndex - diff;
        } else {
            newIndex = tentative;
        }

        // simple board rules
        if (newIndex == 6) {
            newIndex = (newIndex + 3) % boardSize;
        } else if (newIndex == 10) {
            currentPlayer.setBlockedTurns(2);
        }

        currentPlayer.setPosition(newIndex);
        playerGameRepository.save(currentPlayer);

        game.setCurrentTurn((currentTurn + 1) % players.size());
        game = gameRepository.save(game);

        return new DiceRollDTO(gameMapper.toDto(game), dice);
    }
}
