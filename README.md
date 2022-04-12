# Technologie_chmurowe
https://hub.docker.com/r/astokwisz/nodeapp
docker network create nazwa - tworzy nową sieć, domyślnie typu bridge

docker network ls - wypisuje wszystkie sieci

docker network rm nazwa - usuwa sieci o podanej nazwie; wszystkie podłączone do sieci kontenery muszą zostać uprzednio odłączone

docker network inspect nazwa - wyświetla informacje o danej sieci, domyślnie w formacie JSON


LAB 6 - Docker compose

docker-compose up - tworzy i uruchamia kontenery przy użyciu konfiguracji z pliku docker-compose.yml
docker-compose up -d - kontenery zostaną uruchomione w tle
docker-compose stop - zatrzymuje uruchomione kontenery bez ich usuwania
docker-compose down --volumes - zatrzymuje i usuwa uruchomione kontenery, obrazy i sieci utworzone w procesie docker-compose up; argument --volumes dodatkowo usuwa woluminy zadeklarowane w sekcji 'volumes' pliku docker-compose i inne podpięte do kontenerów woluminy