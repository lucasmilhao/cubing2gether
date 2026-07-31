FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

# Copy dependency files and source code
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src

# Build the heavy JAR file
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the slim production image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy only the compiled JAR file from the first stage
COPY --from=build /app/target/*.jar app.jar

COPY src ./src

RUN ./mvnw package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]