# rock-paper-scissors

## Setup

```bash
npm i
# Docker for MySQL database.
docker-compose up -d
# Create the Schema.
./node_modules/.bin/knex migrate:latest
# Start PM2
./node_modules/.bin/pm2 start ./pm2.config.js
```

## Web

[http://localhost:5000/]()

## Manual

```bash
http POST :5010/api/v1/players
http GET :5010/api/v1/players/1
http POST :5010/api/v1/players
http GET :5010/api/v1/players/2
http POST :5005/api/v1/games player1id=1 player2id=2
http GET :5005/api/v1/games/1
http POST :5005/api/v1/games/1/judge
http PATCH :5005/api/v1/games/1 player1choice=rock player2choice=scissors
http POST :5005/api/v1/games/1/judge
http GET :5005/api/v1/games/1
```

## Teardown

Temporary:

```bash
# Stop services.
docker-compose stop
# Turn off PM2.
./node_mobules/.bin/pm2 kill
```

Permanent (deletes database):

```bash
# Stop and remove containers, networks, images and volumes.
docker-compose down
# Turn off PM2.
./node_mobules/.bin/pm2 kill
```

