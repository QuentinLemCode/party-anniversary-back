# Party Anniversary Backend
## Description

Features :
* Invites can add music to playlist
  * Remove music from the playlist
  * limit the number of music in the playlist per user
  * has a backlog of music if playlist is empty
  * see the current playing music
  * they can vote for their music to get them quickly in the playlist
  * they can downvote if they want the music not be played
  * they can skip the current playing music if a certain number of user vote also
* Connect using their name and a secret question
  * one account per IP adress

## Todo
  Handle spotify rate limits

## Installation

Configure .env file

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```