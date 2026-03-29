FROM eclipse-temurin:17-jre

MAINTAINER GROUP100

WORKDIR /app

COPY target/t1d-0.0.1-SNAPSHOT.jar t1d-0.0.1-SNAPSHOT.jar

EXPOSE 8443

ENTRYPOINT ["java","-jar","/app/t1d-0.0.1-SNAPSHOT.jar"]
