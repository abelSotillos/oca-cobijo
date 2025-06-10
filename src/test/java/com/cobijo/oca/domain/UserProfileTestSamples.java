package com.cobijo.oca.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UserProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UserProfile getUserProfileSample1() {
        return new UserProfile().id(1L).nickname("nickname1").avatarUrl("avatarUrl1").sessionId("s1");
    }

    public static UserProfile getUserProfileSample2() {
        return new UserProfile().id(2L).nickname("nickname2").avatarUrl("avatarUrl2").sessionId("s2");
    }

    public static UserProfile getUserProfileRandomSampleGenerator() {
        return new UserProfile()
            .id(longCount.incrementAndGet())
            .nickname(UUID.randomUUID().toString())
            .avatarUrl(UUID.randomUUID().toString())
            .sessionId(UUID.randomUUID().toString());
    }
}
