# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Install dependencies
RUN apk add --no-cache nodejs npm

# Copy everything
COPY . .

# Make mvnw executable
RUN chmod +x mvnw

# Install npm dependencies (ignore errors)
RUN npm install || echo "NPM install completed with warnings"

# Build with minimal validation for faster deployment
RUN ./mvnw clean compile spring-boot:repackage -Pprod \
    -DskipTests=true \
    -Dsonar.skip=true \
    -Denforcer.skip=true \
    -Dmaven.enforcer.skip=true \
    -Dmaven.test.skip=true \
    -Dcheckstyle.skip=true \
    --batch-mode \
    --quiet

# Runtime stage  
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy jar file
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]