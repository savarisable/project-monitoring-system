# ==============================================================================
# Multi-stage Dockerfile for Spring Boot Backend
# Compatible with: Render, Railway, Koyeb, Docker Hub, AWS, GCP
# ==============================================================================

# Stage 1: Build the Maven artifact
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace/app

# Copy dependency descriptor first for layer caching
COPY pom.xml .
COPY src src

# Build executable JAR skipping test execution
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for container health checks
RUN apk --no-cache add curl

# Create directory for file storage & database
RUN mkdir -p /app/uploads /app/data

# Copy built JAR from builder stage
COPY --from=builder /workspace/app/target/*.jar app.jar

# Configuration environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
