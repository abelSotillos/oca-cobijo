# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Install dependencies
RUN apk add --no-cache nodejs npm

# Copy everything
COPY . .

# Make mvnw executable
RUN chmod +x mvnw

# Install npm dependencies
RUN npm install || true

# Build with Maven (skip tests for faster build)
RUN ./mvnw clean package -Pprod -DskipTests --batch-mode -q

# Runtime stage  
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy jar file
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]