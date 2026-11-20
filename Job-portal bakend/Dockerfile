FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build --chown=10001:0 /workspace/target/Job-portal-0.0.1-SNAPSHOT.jar app.jar
USER 10001
EXPOSE 2222
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
