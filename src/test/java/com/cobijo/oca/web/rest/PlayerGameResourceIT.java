package com.cobijo.oca.web.rest;

import static com.cobijo.oca.domain.PlayerGameAsserts.*;
import static com.cobijo.oca.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cobijo.oca.IntegrationTest;
import com.cobijo.oca.domain.PlayerGame;
import com.cobijo.oca.repository.PlayerGameRepository;
import com.cobijo.oca.service.dto.PlayerGameDTO;
import com.cobijo.oca.service.mapper.PlayerGameMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlayerGameResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlayerGameResourceIT {

    private static final Integer DEFAULT_POSITION = 0;
    private static final Integer UPDATED_POSITION = 1;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final Boolean DEFAULT_IS_WINNER = false;
    private static final Boolean UPDATED_IS_WINNER = true;

    private static final String ENTITY_API_URL = "/api/player-games";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlayerGameRepository playerGameRepository;

    @Autowired
    private PlayerGameMapper playerGameMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlayerGameMockMvc;

    private PlayerGame playerGame;

    private PlayerGame insertedPlayerGame;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlayerGame createEntity() {
        return new PlayerGame().position(DEFAULT_POSITION).order(DEFAULT_ORDER).isWinner(DEFAULT_IS_WINNER);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlayerGame createUpdatedEntity() {
        return new PlayerGame().position(UPDATED_POSITION).order(UPDATED_ORDER).isWinner(UPDATED_IS_WINNER);
    }

    @BeforeEach
    public void initTest() {
        playerGame = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPlayerGame != null) {
            playerGameRepository.delete(insertedPlayerGame);
            insertedPlayerGame = null;
        }
    }

    @Test
    @Transactional
    void createPlayerGame() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);
        var returnedPlayerGameDTO = om.readValue(
            restPlayerGameMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playerGameDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PlayerGameDTO.class
        );

        // Validate the PlayerGame in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPlayerGame = playerGameMapper.toEntity(returnedPlayerGameDTO);
        assertPlayerGameUpdatableFieldsEquals(returnedPlayerGame, getPersistedPlayerGame(returnedPlayerGame));

        insertedPlayerGame = returnedPlayerGame;
    }

    @Test
    @Transactional
    void createPlayerGameWithExistingId() throws Exception {
        // Create the PlayerGame with an existing ID
        playerGame.setId(1L);
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlayerGameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playerGameDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkOrderIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        playerGame.setOrder(null);

        // Create the PlayerGame, which fails.
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        restPlayerGameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playerGameDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPlayerGames() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        // Get all the playerGameList
        restPlayerGameMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playerGame.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].isWinner").value(hasItem(DEFAULT_IS_WINNER)));
    }

    @Test
    @Transactional
    void getPlayerGame() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        // Get the playerGame
        restPlayerGameMockMvc
            .perform(get(ENTITY_API_URL_ID, playerGame.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(playerGame.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.isWinner").value(DEFAULT_IS_WINNER));
    }

    @Test
    @Transactional
    void getNonExistingPlayerGame() throws Exception {
        // Get the playerGame
        restPlayerGameMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlayerGame() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playerGame
        PlayerGame updatedPlayerGame = playerGameRepository.findById(playerGame.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlayerGame are not directly saved in db
        em.detach(updatedPlayerGame);
        updatedPlayerGame.position(UPDATED_POSITION).order(UPDATED_ORDER).isWinner(UPDATED_IS_WINNER);
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(updatedPlayerGame);

        restPlayerGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playerGameDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playerGameDTO))
            )
            .andExpect(status().isOk());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlayerGameToMatchAllProperties(updatedPlayerGame);
    }

    @Test
    @Transactional
    void putNonExistingPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playerGameDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playerGameDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playerGameDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playerGameDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlayerGameWithPatch() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playerGame using partial update
        PlayerGame partialUpdatedPlayerGame = new PlayerGame();
        partialUpdatedPlayerGame.setId(playerGame.getId());

        restPlayerGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlayerGame.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlayerGame))
            )
            .andExpect(status().isOk());

        // Validate the PlayerGame in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlayerGameUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPlayerGame, playerGame),
            getPersistedPlayerGame(playerGame)
        );
    }

    @Test
    @Transactional
    void fullUpdatePlayerGameWithPatch() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playerGame using partial update
        PlayerGame partialUpdatedPlayerGame = new PlayerGame();
        partialUpdatedPlayerGame.setId(playerGame.getId());

        partialUpdatedPlayerGame.position(UPDATED_POSITION).order(UPDATED_ORDER).isWinner(UPDATED_IS_WINNER);

        restPlayerGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlayerGame.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlayerGame))
            )
            .andExpect(status().isOk());

        // Validate the PlayerGame in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlayerGameUpdatableFieldsEquals(partialUpdatedPlayerGame, getPersistedPlayerGame(partialUpdatedPlayerGame));
    }

    @Test
    @Transactional
    void patchNonExistingPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, playerGameDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playerGameDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playerGameDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlayerGame() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playerGame.setId(longCount.incrementAndGet());

        // Create the PlayerGame
        PlayerGameDTO playerGameDTO = playerGameMapper.toDto(playerGame);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerGameMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playerGameDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlayerGame in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlayerGame() throws Exception {
        // Initialize the database
        insertedPlayerGame = playerGameRepository.saveAndFlush(playerGame);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the playerGame
        restPlayerGameMockMvc
            .perform(delete(ENTITY_API_URL_ID, playerGame.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return playerGameRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected PlayerGame getPersistedPlayerGame(PlayerGame playerGame) {
        return playerGameRepository.findById(playerGame.getId()).orElseThrow();
    }

    protected void assertPersistedPlayerGameToMatchAllProperties(PlayerGame expectedPlayerGame) {
        assertPlayerGameAllPropertiesEquals(expectedPlayerGame, getPersistedPlayerGame(expectedPlayerGame));
    }

    protected void assertPersistedPlayerGameToMatchUpdatableProperties(PlayerGame expectedPlayerGame) {
        assertPlayerGameAllUpdatablePropertiesEquals(expectedPlayerGame, getPersistedPlayerGame(expectedPlayerGame));
    }
}
