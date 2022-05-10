# Technologie_chmurowe
https://hub.docker.com/r/astokwisz/nodeapp

- docker network create nazwa - tworzy nową sieć, domyślnie typu bridge

- docker network ls - wypisuje wszystkie sieci

- docker network rm nazwa - usuwa sieci o podanej nazwie; wszystkie podłączone do sieci kontenery muszą zostać uprzednio odłączone

- docker network inspect nazwa - wyświetla informacje o danej sieci, domyślnie w formacie JSON


# LAB 6 - Docker compose

## Polecenia pliku docker-compose.yml:

- services - sekcja, w której definiujemy usługi ( kontenery ) naszej aplikacji; nazwa usługi może być dowolna

- - build - definiuje opcje konfiguracyjne, które zostają później użyte przez docker-compose w celu zbudowania obrazu kontenera

- - - context - ściezka zawierająca plik Dockerfile; sekcja wymagana

- - - dockerfile - pozwala wybrać alternatywny plik Dockerfile; sekcja opcjonalna


- - environment - miejsce do definiowania zmiennych środowiskowych dostępnych dla danego kontenera

- - ports - upublicznia porty kontenera

## Wybrane polecenia

- docker-compose up - tworzy i uruchamia kontenery przy użyciu konfiguracji z pliku docker-compose.yml

- docker-compose up -d - kontenery zostaną uruchomione w tle

- docker-compose stop - zatrzymuje uruchomione kontenery bez ich usuwania

- docker-compose down --volumes - zatrzymuje i usuwa uruchomione kontenery, obrazy i sieci utworzone w procesie 'docker-compose up'; argument --volumes dodatkowo usuwa woluminy zadeklarowane w sekcji 'volumes' pliku docker-compose i inne podpięte do kontenerów woluminy

# LAB 8 - K8s

- kubectl apply -f nazwa_pliku - tworzy byt Kubernetesowy na podstawie wskazanego pliku konfiguracyjnego

- kubectl exec =it pod -- komenda - wywołuje komendę w danym podzie, przekierowując wyjście na obecnie wykorzystywany terminal

