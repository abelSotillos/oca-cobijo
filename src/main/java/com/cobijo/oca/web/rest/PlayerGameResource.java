package com.cobijo.oca.web.rest;

import com.cobijo.oca.repository.PlayerGameRepository;
import com.cobijo.oca.service.PlayerGameService;
import com.cobijo.oca.service.dto.PlayerGameDTO;
import com.cobijo.oca.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.cobijo.oca.domain.PlayerGame}.
 */
@RestController
@RequestMapping("/api/player-games")
public class PlayerGameResource {

    private static final Logger LOG = LoggerFactory.getLogger(PlayerGameResource.class);

    private static final String ENTITY_NAME = "playerGame";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlayerGameService playerGameService;

    private final PlayerGameRepository playerGameRepository;

    public PlayerGameResource(PlayerGameService playerGameService, PlayerGameRepository playerGameRepository) {
        this.playerGameService = playerGameService;
        this.playerGameRepository = playerGameRepository;
    }

    /**
     * {@code POST  /player-games} : Create a new playerGame.
     *
     * @param playerGameDTO the playerGameDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new playerGameDTO, or with status {@code 400 (Bad Request)} if the playerGame has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PlayerGameDTO> createPlayerGame(@Valid @RequestBody PlayerGameDTO playerGameDTO) throws URISyntaxException {
        LOG.debug("REST request to save PlayerGame : {}", playerGameDTO);
        if (playerGameDTO.getId() != null) {
            throw new BadRequestAlertException("A new playerGame cannot already have an ID", ENTITY_NAME, "idexists");
        }
        playerGameDTO = playerGameService.save(playerGameDTO);
        return ResponseEntity.created(new URI("/api/player-games/" + playerGameDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, playerGameDTO.getId().toString()))
            .body(playerGameDTO);
    }

    /**
     * {@code PUT  /player-games/:id} : Updates an existing playerGame.
     *
     * @param id the id of the playerGameDTO to save.
     * @param playerGameDTO the playerGameDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playerGameDTO,
     * or with status {@code 400 (Bad Request)} if the playerGameDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the playerGameDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlayerGameDTO> updatePlayerGame(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PlayerGameDTO playerGameDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update PlayerGame : {}, {}", id, playerGameDTO);
        if (playerGameDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playerGameDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playerGameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        playerGameDTO = playerGameService.update(playerGameDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, playerGameDTO.getId().toString()))
            .body(playerGameDTO);
    }

    /**
     * {@code PATCH  /player-games/:id} : Partial updates given fields of an existing playerGame, field will ignore if it is null
     *
     * @param id the id of the playerGameDTO to save.
     * @param playerGameDTO the playerGameDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playerGameDTO,
     * or with status {@code 400 (Bad Request)} if the playerGameDTO is not valid,
     * or with status {@code 404 (Not Found)} if the playerGameDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the playerGameDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PlayerGameDTO> partialUpdatePlayerGame(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PlayerGameDTO playerGameDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PlayerGame partially : {}, {}", id, playerGameDTO);
        if (playerGameDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playerGameDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playerGameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PlayerGameDTO> result = playerGameService.partialUpdate(playerGameDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, playerGameDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /player-games} : get all the playerGames.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of playerGames in body.
     */
    @GetMapping("")
    public ResponseEntity<List<PlayerGameDTO>> getAllPlayerGames(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of PlayerGames");
        Page<PlayerGameDTO> page = playerGameService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /player-games/:id} : get the "id" playerGame.
     *
     * @param id the id of the playerGameDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the playerGameDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlayerGameDTO> getPlayerGame(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PlayerGame : {}", id);
        Optional<PlayerGameDTO> playerGameDTO = playerGameService.findOne(id);
        return ResponseUtil.wrapOrNotFound(playerGameDTO);
    }

    /**
     * {@code DELETE  /player-games/:id} : delete the "id" playerGame.
     *
     * @param id the id of the playerGameDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayerGame(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PlayerGame : {}", id);
        playerGameService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
