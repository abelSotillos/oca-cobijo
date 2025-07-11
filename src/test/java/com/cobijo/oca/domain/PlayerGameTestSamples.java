package com.cobijo.oca.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PlayerGameTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static PlayerGame getPlayerGameSample1() {
        return new PlayerGame().id(1L).position(0).order(1);
    }

    public static PlayerGame getPlayerGameSample2() {
        return new PlayerGame().id(2L).position(1).order(2);
    }

    public static PlayerGame getPlayerGameRandomSampleGenerator() {
        return new PlayerGame().id(longCount.incrementAndGet()).position(intCount.incrementAndGet()).order(intCount.incrementAndGet());
    }
}
