
# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copy everything
COPY . .

# Make mvnw executable
RUN chmod +x mvnw

# Build only the backend, skip frontend completely
RUN ./mvnw clean package -Pprod \
    -DskipTests=true \
    -Dsonar.skip=true \
    -Denforcer.skip=true \
    -Dmaven.enforcer.skip=true \
    -Dmaven.test.skip=true \
    -Dcheckstyle.skip=true \
    -Dskip.npm=true \
    -Dskip.bower=true \
    -Dfrontend.skip=true \
    --batch-mode

# Runtime stage  
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001 -G spring

# Copy jar file
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/management/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]