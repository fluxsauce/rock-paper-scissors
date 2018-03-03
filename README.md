# rock-paper-scissors

## Setup

```bash
npm i
# Docker MySQL database.
docker-compose up -d
# Create the Schema.
./node_modules/.bin/knex migrate:latest
# Start PM2
./node_mobules/.bin/pm2 start ./pm2.config.js
```

## Manual

```bash
http POST :5010/api/v1/players
http POST :5010/api/v1/players
http POST :5005/api/v1/games player1id=1 player2id=2
http GET :5005/api/v1/games/1
http POST :5005/api/v1/games/1/judge
http PATCH :5005/api/v1/games/1 player1choice=rock player2choice=scissors
http POST :5005/api/v1/games/1/judge
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

