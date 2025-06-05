package com.cobijo.oca.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GameTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Game getGameSample1() {
        return new Game().id(1L).code("code1").currentTurn(1);
    }

    public static Game getGameSample2() {
        return new Game().id(2L).code("code2").currentTurn(2);
    }

    public static Game getGameRandomSampleGenerator() {
        return new Game().id(longCount.incrementAndGet()).code(UUID.randomUUID().toString()).currentTurn(intCount.incrementAndGet());
    }
}
