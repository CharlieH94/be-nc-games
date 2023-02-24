# Northcoders House of Games API

## Hosted API
https://be-nc-games-project.onrender.com/

## Overview
- The purpose of this Northcoders project was to build an API that facilitates access to application data programmatically.
- The objective was to mimic a 'real world' backend service, which should provide information to the front end architecture.

## Features
- Multiple available endpoints.
- Try path '/api' to start exploring!

## Setup
To set up on your local environment, you must:
1. Clone this repo
2. Install it's dependencies
3. Seed the local database

In order to successfully connect the 2 databases locally, you must add some.env files to your local project (see below).

### Adding .env files
Create two files:
1) .env.development
    - This will allow connection to your development database
    - Paste the following into the file:
        PGDATABASE=data_base_name

2) .env.test
    - This will allow connection to your test database
    - Paste the following into the file:
        PGDATABASE=data_base_name_test

## Technologies
- PSQL
- JS / node-postgres
- Express
- Dotenv
- Jest and Supertest
- Git and GitHub
- Command Line
- ElephantSQL
- Render