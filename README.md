# wp-ms-surveys

Dieses Projekt stellt zwei Services zur Verfügung, die miteinander Kommunizieren.\
Es wird dabei auch eine Mongo-Datenbank als Container gestartet.

Es geht um Umfragen, die einen Titel, eine Menge von Fragen und einen Zähler für die Anzahl an abgegebenen Antworten haben. \
Die Fragen haben wiederum einen Titel und Menge an Antworten.\
Die Antworten haben nur einen Titel.

Damit ist es möglich eine Umfrage mit mehreren Fragen und mehreren Antwortmöglichkeiten zu erstellen.

Der Opinion-Service braucht zum Erstellen einer Antwort eine SurveyId, damit er mit der Umfrage direkt in Verbindung gebracht werden kann.\
Eine Opinion hat auch eine Menge an "Responses", die zu jeder Frage eine Menge an Antworten festhällt. Damit ist es möglich, dass nicht alle Fragen beantwortet werden, und man mehr als eine Antwort abgeben kann.

Komplexe Konstellationen von Frage und Antwort, die in der Marktforschung üblich sind, werden hier nicht berücksichtigt. Dieses Projekt dient lediglich als ein Prototyp, der Microservices nutzt.

Der Bereich Core unter src beinhaltet alle Klassen, die von allen Services genutzt werden können.\
Die Schemata wurden in die einzelnen Services gelegt, da hier beschlossen wurde, dass jeder Service für eine Collection zuständig ist.

Wenn eine Detailseite der Survey aufgerufen wird, holt sie sich von dem OpinionService alle Antworten. Und fügt sie dem Rückgabewert hinzu.

Wenn eine Opinion angelegt wird, erhöht sie den "userCounter" bei der Survey, in dem der Survey-Service aufgerufen wird.

## Aufrufe

### Survey
#### GET
- `/survey/health` health check 
- `/survey` Liste 
- `/survey/:id` Details
#### POST
- `/survey` Erstellen
#### PUT
- `/survey/:id` Attribute neu setzen
#### PATCH
- `/survey/:id` einzelne Attribute verändern (wird für den userCounter verwendet)
#### DELETE
- `/survey/:id` Löschen

### Opinion
#### GET
- `/opinion/health` health check
- `/opinion` Liste
- `/opinion?surveyId=...` Liste für eine Survey
- `/opinion/:id` Details
#### POST
- `/opinion` erstellen
#### DELETE
- `/opinion/:id` löschen

## Kompilieren
`npm run build`

## Tests Starten
- alle test: `npm test`
- survey: `npm run testSurvey` oder `npm run testDotSurvey`
- opinion: `npm run testOpinion` oder `npm run testDotOpinion`

Um die Parameter zu überschreiben ist es einfacher direkt mocha auf zu rufen:
- survey: `mocha --MONGO_URI=... --FOREIGN_SERVICE_OPINION=... --PORT=... --ENVIRONMENT="test" dist/Survey/Test`
- opinion: `mocha  --MONGO_URI=... --FOREIGN_SERVICE_SURVEY=... --PORT=... --ENVIRONMENT="test" dist/Opinion/Test`

## Service Starten
### Survey
- einzeln: `node -r source-map-support/register dist\Survey\index.js --PORT=8080`
- daemon: `pm2 start dist/Survey/index.js --name "survey" --source-map-support`
- Parameter können überschreiben werden:
   - MONGO_URI: Das Default ist `mongodb://localhost:27017/wp-ms-surveys`.
   - FOREIGN_SERVICE_OPINION: Das Default ist `http://localhost:8081/opinion` 
   - PORT: Das Default ist `8080` 
   - ENVIRONMENT: Das Default ist `development`. `production` und `test` sind mögliche Eingaben. 
### Opinion
- einzeln: `node -r source-map-support/register dist\Opinion\index.js --PORT=8081`
- daemon: `pm2 start dist/Opinion/index.js --name "opinion " --source-map-support`
- Parameter können überschreiben werden:
   - MONGO_URI: Das Default ist `mongodb://localhost:27017/wp-ms-surveys`.
   - FOREIGN_SERVICE_SURVEY: Das Default ist `http://localhost:8080/survey` 
   - PORT: Das Default ist `8081` 
   - ENVIRONMENT: Das Default ist `development`, `production` und `test` sind mögliche Eingaben. 
### Docker
`docker-compose up -d`
   
## Tech-Stack
- Node.JS
- TypeScript
- MongoDB
- Docker
- AWS

## Packages - Global
- `npm mocha` Framework für die Tests.
- `npm pm2` ein Daemon um die Instanzen von Node.JS zu verwalten.
- `npm source-map-support` notwendig für mocha und für den regulären start von node um den Stack-Trace von JS nach TS um zu wandeln.
- `npm ts-node` notwendig für mocha, damit es on the fly von TS nah JS compiliert.
- `npm typescript` zum Umwandeln des TS scripts nach JS.

## Packages - Lokal
- `npm express` Framework für die erstellung des Servers.
  - `npm body-parser` middleware um den Body vorzubereiten.
  - `npm compression` middleware um den Traffic zu komprimieren. 
  - `npm helmet` middleware um die Sicherheit der Api zu erhöhen.
  - `npm morgan` middleware um logs von express interaktionen zu managen.
- `npm minimist` Library für das Parsen von eingegebenen Argumenten beim Start.
- `npm mongoose` Framework für die Anbindung an die Datenbank
- `npm node-fetch` Library um Requests an die anderen Services zu machen.  
- `npm source-map-support` Mocha findet manchmal das global installierte Package nicht, daher noch mal lokal. Es dient um den JS-Stack-Trace nach TS um zu wandeln.
- `npm validator` für den AValidator um nicht alle Methoden selbst schreiben zu müssen.

## Packages - Development
- diverse @type packages für TS-Typen
- `npm should` eine Vereinfachung der asserts und validierungen für die Tests
- `npm typescript` Im Grunde reicht das globale Package in dem globalen scope. Es wird trotzdem hier genutzt um sicher zu stellen, dass jede version eine eigene bestimmte TS-Version hat.

## Grundlegender Aufbau des Services
Jeder Service besteht aus ...:
- `index.ts`, die die App startet.
- `Controller.ts`, der die Apis definiert.
- `Service.ts`, der vom Controller aufgerufen wird um die Businesslogic zu verwalten und das Model initializiert.
- `Model.ts`, dass eine Verbindung zur Datenbank mit hilfe des Schemas definiert, die Queries baut und einen Validator hat.
- `Validator.ts`, der die Methoden fest hällt um die eingehenden Daten von der API zu validieren und den Eintrag in der Datenbank zu prüfen.
- `Schema.ts`, dass die Struktur der Collection in der Datenbank definiert.
- `ForeignService` (optional), der methoden zum Aufruf des externen Services mappt.
- `Test` (optional), für das Erstellen der Mocha-Tests.

Alle außer der index.ts finden alle eine abstrakte Klasse im Core.

## Core
### AObject.ts
Fast alle Klassen im Core und alle in den Services, leiten von dieser Klasse direkt oder indirekt ab. Damit stehen einige Methoden zur Verfügung, wie log oder logError.\
Alle Klassen bekommen den init als asynchrone Methode bereitgestellt. Es empfiehlt sich nach dem "new-Aufruf" das init immer aufzurufen.

### App.ts
Die App-Klasse sorgt dafür, dass "npm express" und "npm mongoose" initialisiert werden.

Zum Erstellen der Klasse verlangt sie im Konstruktor einen Controller. Mehr als ein Kontroller vom Typ AController ist pro App nicht vorgesehen. Es können aber mehrere externe Services definiert werden.

Das Erstellen der App Instanz erfolgt jeweils in der index.ts. Man kann mindestens einen Externen Service hinzufügen vom Typ AForeignService.
 
Der init muss nicht aufgerufen werden, das passiert in start Methode bereits automatisch.

### AController.ts
Definieren der API-Pfade.

Das Setzen des Paths definiert den Path, auf dem die API's registriert werden.\
In den Methoden get, post, put, patch und delete kann man Actions erstellen, die dann als Paths für die API's genommen werden.\
Wenn die Action den Namen index trägt, wird sie zu '\' umgewandelt. Damit ist sie direkt under dem Path-Namen erreichbar.\
Variablen, die im Path übermittelt werden sollen, können mit ":" starten. Siehe Dokumentation von `npm express`.

### AForeignService.ts (@SingletonObject)
Festlegen der externen Services.

Ähnlicher Aufbau wie AController, bekommt aber eine frei definierbare Menge an Parametern, die dann zum Request entsprechend gemappt werden, in dem man _perform['method']Request aufruft.\
Damit bindet man externe Services ein.\
Der Path muss dabei die komplette URL zu dem Service sein. Dieser sollte durch Eingabeargumente überschrieben werden können. 

### AModel.ts (@SingletonObject)
Zusammenstellen und Durchführen der Datenbankanfragen.

Models brauchen ein Schema, dass die Collection beschreibt und einen Validator, der die Eingaben in die Datenbank Validiert.\
Es werden einige Standardmethoden bereitgestellt, die intern den Validator nutzen.\
Das initialisieren des Validators und des Schemas wird automatisch erledigt.\
Die Methode getDB darf nur für die Tests genutzt werden!\
Jedes Model sollte nach Möglichkeit nur einen Validator nutzen.\
Die Methode getValidator darf vom Service genutzt werden.

### ASchema.ts
Definieren der MongoDB-Collection.

Es wird der Name benötigt, der die Collection benennt.\
In getSchema kann man nicht nur das Schema der Collection, sondern auch Indexe und weiter Teile der Collection definieren. Siehe Dokumentation von `npm mongoose`.

### AService.ts (@SingletonObject)
Bereitstellen der Business-Logic.

Es benötigt das Model, das automatisch initialisiert wird und stellt einige Standartmethoden zur Verfügung.\
Die Methode getModel darf nur für die Tests genutzt werden! Wenn man mehrere Services hat, dürfen sie sich gegenseitig aufrufen, jedoch darf ein Service nur ein Model bedienen.\
Hier, und nur hier, sind die externen Services zu nutzen, wenn welche definiert wurden!

### AValidator.ts (@SingletonObject)
Validierung und Filterung der Parameter für den Controller und Model.\

Der Validator kann jedoch auch in einem Service genutzt werden. Zum Beispiel durch die Methode getValidator dessen Models.
Die verify...-Methoden sind sehr wichtig, da sie automatisch vom Model aufgerufen werden.\
die verify...External-Methoden sollten vom Controller genutzt werden.\
Die _validate und _validateArray Methoden sind hilfreich um die Validierung zu vereinfachen und die Fehler zu sammeln, damit man nicht für jeden falschen Parameter einzelnd den Fehler raus holen muss.
Dabei muss man darauf achten, dass somit auch Folgefehler ausgegeben werden können. 

### DB.ts (@SingletonObject)
Verbindung zur Datenbank herstellen, mit Hilfe von `npm mongoose`.
Wenn festgestellt wird, dass die Umgebung ein Test ist, wird zu der mongo URI _test hinzugefügt, um nicht in der Produktiondatenbank alles zu leeren.

## Core/Declarator
Ordner für Types, Enums und andere reine Definitionsdaten.

### CollectionObject.ts
Ein Typ um den Datentransfer zwischen API und Mongo zu erleichtern.

### ControllerIncome.ts
Der Typ der Daten, die vom AController an die einzelnen Actions übermittelt werden. 

### ControllerOutgoings.ts
Der Typ der Daten, die an den externen Service rausgehen.

### Environments.ts
Enum für alle möglichen Startprameter des Services.

### ErrorContainer.ts
Nur ein Array der ErrorMessages.

### ErrorMessage.ts
Typ für eine Standardisierung für die Fehlermeldungen.

### ErrorType.ts
Enum für die verschiedenen Arten des Fehlers.

## Decorator

### GetProxy.ts
Hilfsklasse für SingletonObject.ts

### SingletonObject.ts
Ein Decorator, der dafür Sorgt, dass jede Klasse nur ein mal instanziiert wird.

## Error
### AError.ts
Abstrakte klasse, die von Error ableitet.

Statt der message sollte hier die Methoden getMessage oder getMessageObject genutzt werden.\
Es hat auch einen Status, der im ErrorHandler genutzt wird, um die API entsprechend hand zu haben. 

### BadRequest.ts
Gibt den Status 400 aus, wenn die Eingabe des User falsch war.

### ConnectForeignService.ts
Ist ein interner fehler, der extra dafür genutzt wird um Verbindungen zum externen Service hand zu haben.

### InternalServerError.ts
Wenn etwas schiefläuft, dass kein Fehler der Parameter des Users ist und die Fehlermeldung nicht zwingend an den User weitergeleitet werden soll.

### NotImplemented.ts
Gibt den HTTP-Status 501 an den User zurück.

## Core/Helper

### Arguments.ts
Hilfsklasse um die Startparameter zu holen.

### ErrorHandler.ts
Hilfsklasse für die App.ts um Fehler zu analysieren.

### LogManager.ts
Utilityklasse für AObject, damit die logs mit Zusatzdaten angereichert werden, wie dem Datum + Uhrzeit und dem Pfad, wo der Aufruf erfolgte.

### Tools.ts
Utilityklasse um einige allgemeine Funktionen global zur Verfügung zu stellen.

## Mongo
Beinhaltet nur die Dateien für den Deploy.

## Survey

### Health Check
GET -> http://localhost:8080/survey/health
````json
{
    "error": null,
    "success": {
        "ok": true
    }
}
````

### Erstellen
POST -> http://localhost:8080/survey/

Body:
```json
{
  "title": "asdf", 
  "questions": [
    {
      "title": "A oder B?", 
      "answers":[
        {"title": "A"}, 
        {"title": "B"}
      ]
    }
  ]
}
```
Result:
````json
{
    "error": null,
    "success": {
        "userCounter": 0,
        "_id": "5f0b1e3c53201c4fd8ad76e3",
        "title": "asdf",
        "questions": [
            {
                "_id": "5f0b1e3c53201c4fd8ad76e4",
                "title": "A oder B?",
                "answers": [
                    {
                        "_id": "5f0b1e3c53201c4fd8ad76e5",
                        "title": "A"
                    }
                ]
            }
        ],
        "__v": 0
    }
}
````
### Liste holen
GET -> http://localhost:8080/survey/
- liefert eine Liste der Surveys
````json
{
    "error": null,
    "success": [
        {
            "_id": "5f0b1e3c53201c4fd8ad76e3",
            "userCounter": 0,
            "title": "asdf",
            "questions": [
                {
                    "_id": "5f0b1e3c53201c4fd8ad76e4",
                    "title": "A oder B?",
                    "answers": [
                        {
                            "_id": "5f0b1e3c53201c4fd8ad76e5",
                            "title": "A"
                        }
                    ]
                }
            ],
            "__v": 0
        }
    ]
}
````
### Survey Details
GET -> http://localhost:8080/survey/5f0b097453201c4fd8ad76db
````json
{
    "error": null,
    "success": {
        "_id": "5f0b097453201c4fd8ad76db",
        "userCounter": 1,
        "title": "foo",
        "questions": [
            {
                "_id": "5f0b097453201c4fd8ad76dc",
                "title": "A or B",
                "answers": [
                    {
                        "_id": "5f0b097453201c4fd8ad76dd",
                        "title": "A"
                    },
                    {
                        "_id": "5f0b097453201c4fd8ad76de",
                        "title": "B"
                    }
                ]
            }
        ],
        "__v": 0,
        "opinions": []
    }
}
````
### Löschen
DELETE -> http://localhost:8080/survey/5f0b1f3a53201c4fd8ad76e6
````json
{
    "error": null,
    "success": true
}
````
### Neu setzen
PUT -> http://localhost:8080/survey/5f0b0a1d53201c4fd8ad76df

Body:
````json
{
  "questions": [
    {
      "title":"foo", 
      "answers": [
        {"title": "A"}, 
        {"title": "B"}
      ]
    }
  ]
}
````
Result:
````json
{
    "error": null,
    "success": {
        "questions": [
            {
                "_id": "5f0b1ffa53201c4fd8ad76e9",
                "title": "foo",
                "answers": [
                    {
                        "_id": "5f0b1ffa53201c4fd8ad76ea",
                        "title": "A"
                    },
                    {
                        "_id": "5f0b1ffa53201c4fd8ad76eb",
                        "title": "B"
                    }
                ]
            }
        ]
    }
}
````
### Ändern
PATCH -> http://localhost:8080/survey/5f0b0a1d53201c4fd8ad76df?userCounter=1

Result:
````json
{
    "error": null,
    "success": {
        "userCounter": 2
    }
}
````

## Opinion

### Health Check
GET -> http://localhost:8081/opinion/health
````json
{
    "error": null,
    "success": {
        "ok": true
    }
}
````

### Erstellen
POST -> http://localhost:8081/opinion

Body:
````json
{
    "surveyId": "5f0b0a1d53201c4fd8ad76df",
    "response": [{
        "questionId": "5f0b1ffa53201c4fd8ad76e9",
        "answerIds": ["5f0b1ffa53201c4fd8ad76ea"]
    }] 
}
````
Result:
````json
{
    "error": null,
    "success": {
        "_id": "5f0b2674e8b6c65b1c705959",
        "surveyId": "5f0b0a1d53201c4fd8ad76df",
        "response": [
            {
                "answerIds": [
                    "5f0b1ffa53201c4fd8ad76ea"
                ],
                "_id": "5f0b2674e8b6c65b1c70595a",
                "questionId": "5f0b1ffa53201c4fd8ad76e9"
            }
        ],
        "__v": 0
    }
}
````

### Liste Holen
GET -> http://localhost:8081/opinion

````json
{
    "error": null,
    "success": [
        {
            "_id": "5f0b2674e8b6c65b1c705959",
            "surveyId": "5f0b0a1d53201c4fd8ad76df",
            "response": [
                {
                    "answerIds": [
                        "5f0b1ffa53201c4fd8ad76ea"
                    ],
                    "_id": "5f0b2674e8b6c65b1c70595a",
                    "questionId": "5f0b1ffa53201c4fd8ad76e9"
                }
            ],
            "__v": 0
        }
    ]
}
````

### Detailaufruf
GET -> http://localhost:8081/opinion/5f0b2674e8b6c65b1c705959

````json
{
    "error": null,
    "success": {
        "_id": "5f0b2674e8b6c65b1c705959",
        "surveyId": "5f0b0a1d53201c4fd8ad76df",
        "response": [
            {
                "answerIds": [
                    "5f0b1ffa53201c4fd8ad76ea"
                ],
                "_id": "5f0b2674e8b6c65b1c70595a",
                "questionId": "5f0b1ffa53201c4fd8ad76e9"
            }
        ],
        "__v": 0
    }
}
````

### Für eine bestimmte Survey alle Opinions löschen 
DELETE -> http://localhost:8081/opinion?surveyId=5f0b0a1d53201c4fd8ad76df
 ````json
{
    "error": null,
    "success": true
}
````