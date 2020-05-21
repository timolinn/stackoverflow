# Stackoverflow Clone

## Required Tech

+ Nodejs. _node `12` and above is recommended._
+ MongoDB
+ Redis
+ Elasticsearch

## How to run

> I deliberately left some environment variable set in .env.example

+ First clone this repo
+ run `npm install`.
+ run `npm run build`
+ Copy `.env.example` into `.env` file. (`cp .env.eaxmple .env`)
+ run `npm start` to start the server.

## Docker

To use docker:

+ Clone this repo
+ Run `cd stackoverflow`
+ Run the following command

```bash
  $ docker-compose up
```

## API docs

To view the docs via the browser, visit [localhost:8000/api/v1/docs](localhost:8000/api/v1/docs). Unfortunately it still needs some work to be consistent. I'll provide a brief description and usage techniques of all existing endpoints.

### User Signup

+ `/api/v1/users/signup` - `POST`: creates a new user account.
  + `firstName` - `string`, `required`
  + `lastName` - `string`, `required`
  + `email` - `string`, `required`
  + `password` - `string`, `required`

+ `returns`:

```javascript
  {
    "apiVersion": "1.0",
    "status": "success",
    "message": "new user created",
    "data": {
        "kind": "User",
        "items": [
            {
                "active": true,
                "role": "user",
                "isVerified": false,
                "firstName": "Jon",
                "lastName": "Doe",
                "email": "jon@example.com",
                "password": null,
                "createdAt": "2020-05-21T22:26:27.218Z",
                "updatedAt": "2020-05-21T22:26:27.218Z",
                "id": "5ec70013a55d093ea62d5da0"
            }
        ]
    }
}
```

### User sign in

+ `/api/v1/users/signin` - `POST`: authenticates a user
+ Payload:
  + `email` - `string`, `required`
  + `password` - `string`, `required`

+ `returns`:

```javascript
  {
    "apiVersion": "1.0",
    "status": "success",
    "message": "user now logged in",
    "data": {
        "kind": "User",
        "items": [
            {
                "id": "5ec70013a55d093ea62d5da0",
                "email": "jon@example.com",
                "isVerified": false,
                "fullName": "Jon Doe",
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWM3MDAxM2E1NWQwOTNlYTYyZDVkYTAiLCJzdWIiOiI1ZWM3MDAxM2E1NWQwOTNlYTYyZDVkYTAiLCJyb2xlIjoidXNlciIsImlhdCI6MTU5MDEwMDMzMiwiZXhwIjoxNTkwMTAxMjMyLCJqdGkiOiIxNWMwMzg0YS01Yzc1LTRiMDAtYjZjZC1kM2IxNGQxM2Y5MGEifQ.E1ijvom5syRttHC4Owgi2tHmKGCDN2xCObdKypSGciE",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWM3MDAxM2E1NWQwOTNlYTYyZDVkYTAiLCJzdWIiOiI1ZWM3MDAxM2E1NWQwOTNlYTYyZDVkYTAiLCJyb2xlIjoidXNlciIsImlhdCI6MTU5MDEwMDMzMiwiZXhwIjoxNTkxMzA5OTMyLCJqdGkiOiIxNWMwMzg0YS01Yzc1LTRiMDAtYjZjZC1kM2IxNGQxM2Y5MGEifQ.UpAqM4-hya2DnqsoZ-qQ2XU0ITfUY5OnNv9TYdM2S7o"
            }
        ]
    }
}
```

### Ask Question

+ `/api/v1/questions` - `POST`: creates a new question record. Authorization `Bearer token` must be specified in the header.
+ Payload:
  + `title` - `string`, `required`
  + `body` - `string`, `required`
  + `tags` - `array`, `required`

+ `returns`: The created question object

### View Question

+ `/api/v1/questions/{questionID}` - `GET`: fetches the question with specified ID, report 404 error if document is not found!

### Upvote & Downvote a question

+ `/api/v1/questions/{questionID}/upvote` - `POST`: upvotes a question. Authorization `Bearer token` must be specified in the header.
+ Payload: `nil`

+ `/api/v1/questions/{questionID}/downvote` - `POST`: downvotes a question. Authorization `Bearer token` must be specified in the header.
+ Payload: `nil`

### Answer Question

+ `/api/v1/answers` - `POST`: creates a new answer to a question. Authorization `Bearer token` must be specified in the header.
+ Payload:
  + `text` - `string`, `required`
  + `question` - `string`, `required`

### Search

+ `/api/v1/search` - `GET`: performs efficient text search.
+ Query String:
  + `query`
  + `index` - [OPTIONAL]

## Seeding

Visit <http://localhost:8000/seed>

## Test

To run test `npm test` should run all test suites. However if you wish to run specific test to can use pattern matching to run all tests that matches the provided pattern.

`npm test -- -t=auth` would run all test cases that have `auth` in it's `describe` function.

## TODO

+ Authorisation (RBAC)
+ Complete Documentation
+ User Subscribe to question
+ Clean up code and add more tests
+ Add more code comments and doc blocks
