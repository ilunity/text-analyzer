FROM openjdk:17
EXPOSE 8089
WORKDIR /opt/app
VOLUME /data
ENV JAVA_OPTIONS="-Xms256m -Xmx1024m"
COPY target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
