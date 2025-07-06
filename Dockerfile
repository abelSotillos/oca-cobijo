# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Install Node.js for frontend build
RUN apk add --no-cache nodejs npm

# Copy Maven wrapper and make it executable
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Copy package files for npm
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src
COPY webpack ./webpack

# Build the application
RUN ./mvnw -Pprod clean verify -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001 -G spring

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/management/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]