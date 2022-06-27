# Baza albumów muzycznych

Aplikacja pozwala na przechowywanie danych albumów muzycznych i wykonywanie operacji CRUD na tych danych. Dane zapisywane są na stałe do bazy MongoDB, a także tymczasowo w bazie Redis. Rekordy z bazy Redis wykorzystywane są do śledzenia ostatnio dodanych / zmodyfikowanych albumów.

## Konfiguracja poszczególnych serwisów

Dla serwisów bazodanowych utworzyłem obrazy na podstawie plików Dockerfile, które wykorzystane są w konfiguracji deploymentu kubernetesowego. Baza Mongo ma ponadto przydzielony wolumen w postaci PersistentVolumeClaim, aby zapewnić trwałość danych. Aplikacja frontendowa wystawiona jest przez ingress-nginx pod adresem localhost:80. Api jest wystawione przez serwis NodePort na porcie 30500. Ze względu na to, że wszystkie serwisy znajdują się w jedynm deploymencie, utrzymywana jest tylko jedna replika. Jest to spowodowane tym, że baza danych MongoDB przywłaszcza sobie prawa dostępu do pewnych plików lockfile, przez co inne repliki nie miałyby do nich dostępu.