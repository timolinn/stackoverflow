# Stackoverflow Clone

## How to run

+ First clone this repo

> Make sure you have at least node `12.13.1 lts` installed

+ run `npm install`.
+ run `npm run build`

> Copy `.env.example` into `.env` file

+ run `npm start` to start the server.

> Make sure you have mongodb setup on your machine.

## API docs

To view the docs locally, visit [localhost:5000/api/v1/docs](localhost:5000/api/v1/docs) via the browser. _Note that the documentation is not up to date._

## Test

To run test `npm test` should run all test suites. However if you wish to run specific test to can use pattern matching to run all tests that matches the provided pattern.

`npm test -- -t=auth` would run all test cases that have `auth` in it's `describe` function.

## TODO

+ Authorisation
