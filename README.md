# rock-paper-scissors

## Setup

```bash
npm i
# Create the Schema.
./node_modules/.bin/knex migrate:latest
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
