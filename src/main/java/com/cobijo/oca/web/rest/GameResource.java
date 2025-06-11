package com.cobijo.oca.web.rest;

import com.cobijo.oca.repository.GameRepository;
import com.cobijo.oca.service.GameService;
import com.cobijo.oca.service.dto.GameDTO;
import com.cobijo.oca.web.rest.errors.BadRequestAlertException;
import com.cobijo.oca.web.websocket.GameWebsocketService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cobijo.oca.domain.Game}.
 */
@RestController
@RequestMapping("/api/games")
public class GameResource {

    private static final Logger LOG = LoggerFactory.getLogger(GameResource.class);

    private static final String ENTITY_NAME = "game";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GameService gameService;

    private final GameRepository gameRepository;

    private final GameWebsocketService gameWebsocketService;

    public GameResource(GameService gameService, GameRepository gameRepository, GameWebsocketService gameWebsocketService) {
        this.gameService = gameService;
        this.gameRepository = gameRepository;
        this.gameWebsocketService = gameWebsocketService;
    }

    /**
     * {@code POST  /games} : Create a new game.
     *
     * @param gameDTO the gameDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gameDTO, or with status {@code 400 (Bad Request)} if the game has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GameDTO> createGame(@Valid @RequestBody GameDTO gameDTO) throws URISyntaxException {
        LOG.debug("REST request to save Game : {}", gameDTO);
        if (gameDTO.getId() != null) {
            throw new BadRequestAlertException("A new game cannot already have an ID", ENTITY_NAME, "idexists");
        }
        gameDTO = gameService.save(gameDTO);
        gameWebsocketService.sendGameUpdate(gameDTO);
        return ResponseEntity.created(new URI("/api/games/" + gameDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, gameDTO.getId().toString()))
            .body(gameDTO);
    }

    @PostMapping("/create-room")
    public ResponseEntity<GameDTO> createRoom() throws URISyntaxException {
        GameDTO gameDTO = gameService.createRoom();
        return ResponseEntity.created(new URI("/api/games/" + gameDTO.getId())).body(gameDTO);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<GameDTO> startGame(@PathVariable("id") Long id) {
        LOG.debug("REST request to start Game : {}", id);
        GameDTO gameDTO = gameService.startGame(id);
        gameWebsocketService.sendGameUpdate(gameDTO);
        return ResponseEntity.ok().body(gameDTO);
    }

    /**
     * {@code PUT  /games/:id} : Updates an existing game.
     *
     * @param id the id of the gameDTO to save.
     * @param gameDTO the gameDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameDTO,
     * or with status {@code 400 (Bad Request)} if the gameDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gameDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GameDTO> updateGame(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GameDTO gameDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Game : {}, {}", id, gameDTO);
        if (gameDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        gameDTO = gameService.update(gameDTO);
        gameWebsocketService.sendGameUpdate(gameDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gameDTO.getId().toString()))
            .body(gameDTO);
    }

    /**
     * {@code PATCH  /games/:id} : Partial updates given fields of an existing game, field will ignore if it is null
     *
     * @param id the id of the gameDTO to save.
     * @param gameDTO the gameDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameDTO,
     * or with status {@code 400 (Bad Request)} if the gameDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gameDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gameDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GameDTO> partialUpdateGame(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GameDTO gameDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Game partially : {}, {}", id, gameDTO);
        if (gameDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GameDTO> result = gameService.partialUpdate(gameDTO);
        result.ifPresent(gameWebsocketService::sendGameUpdate);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gameDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /games} : get all the games.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of games in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GameDTO>> getAllGames(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Games");
        Page<GameDTO> page;
        if (eagerload) {
            page = gameService.findAllWithEagerRelationships(pageable);
        } else {
            page = gameService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /games/:id} : get the "id" game.
     *
     * @param id the id of the gameDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gameDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGame(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Game : {}", id);
        Optional<GameDTO> gameDTO = gameService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gameDTO);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<GameDTO> getGameByCode(@PathVariable("code") String code) {
        LOG.debug("REST request to get Game by code : {}", code);
        Optional<GameDTO> gameDTO = gameService.findOneByCode(code);
        return ResponseUtil.wrapOrNotFound(gameDTO);
    }

    /**
     * {@code DELETE  /games/:id} : delete the "id" game.
     *
     * @param id the id of the gameDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Game : {}", id);
        gameService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
