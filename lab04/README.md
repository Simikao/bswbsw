**Zadanie 1**\
Celem zadania jest przeprowadzenie procesu pozyskania tokenu autoryzacyjnego wg [Client Credentials Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow) i wyświetleniu go w API w `Resource Server`. Client Credentials Flow wykorzystywany jest w komunikacji typu backend-to-backend. W tym Flow nie ma użytkownika, `User Agent` w postaci przeglądarki czy aplikacji mobilnej lub natywnej nie występuje. Nie można zastosować mechanizmów typu przekierowania itp. technik wykorzystywanych w `Authorization Code Flow`. \
\
Zadanie należ wykonać dla dwóch instancji `Authorization Server`, których setup został wykonany na poprzednich zajęciach:

- Keycloak - środowisko lokalne oparte o Docker Compose
- Okta for developers - środowisko lokalne (może być lokalne oparte o Docker Compose) z serverem autoryzacyjnym w postaciu usługi online
  \
  Składowe:

1. `Client` - backend aplikacji webowej (NodeJS + Express), który uzyskuje dostęp do API
1. `Resource Server` - aplikacja webowa wystawiająca HTTP API (NodeJS + Express)
1. `Authorization Server` - Keycloak w środowisku lokalnym i Okta w postaci usługi online

Proponowane kroki:

1. zdefiniować klienta w Serwerze Autoryzacyjnym. Należ szukać opcji związanych z `Client Credentials Flow/Grant` lub dla aplikacji "backend to backend" lub "machine to machine". Pozyskać `ClientID` oraz `Client Password`. Dalej należ ustalić dwa endpointy serwera autoryzacyjnego:

- auth endpoint
- token endpoint

1. zapimplementować flow
1. sprawdzić poprawność otrzymanego tokenu w serwisie online [JWT](https://jwt.io)
