FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia o pom
COPY pom.xml .

# Copia o JAR do TNoodle
COPY TNoodle-WCA-1.2.3.jar .

# Instala o TNoodle no repositório Maven local
RUN mvn install:install-file \
    -Dfile=TNoodle-WCA-1.2.3.jar \
    -DgroupId=org.worldcubeassociation \
    -DartifactId=tnoodle \
    -Dversion=1.2.3 \
    -Dpackaging=jar

# Baixa as dependências
RUN mvn dependency:go-offline

# Copia o código-fonte
COPY src ./src

# Compila o projeto
RUN mvn clean package -DskipTests

# Imagem final
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]