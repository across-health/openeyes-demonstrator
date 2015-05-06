# OpenEyes Demonstrator

[![Build Status](https://travis-ci.org/davet1985/openeyes-demonstrator.svg?branch=master)](https://travis-ci.org/davet1985/openeyes-demonstrator)

## Development

To run locally for development ensure you have the following installed.

* node.js, or more specifically, we are using iojs v1.8.1

For mac I would recommend installing Node Version Manager (nvm) through homebrew. `brew install nvm` and then installing io.js using that, `nvm install iojs` and `nvm use iojs`

Node comes with a version of NPM but to make sure it's up-to-date run `npm install -g npm`

Then a couple of node modules need to be installed globally, so run these.

```sh
npm install -g gulp
npm install -g bower
```

From here you should be able to run `npm start` and it will download all the necessary node modules, bower components and gulp will do it's thing and the server should be running on http://localhost:3000.

For development you might want to install nodemon and run using `nodemon bin/www`

This will watch for file changes and automatically restart the server for you.

Also to watch and compile assets you should also have a terminal open running `gulp watch`

## Install submodules

## Folder structure

`/data` - sample JSON data that could come from a back-end service

`/eyedraw` - git submodule

`/patient_app` - angularJS app for patient screen

`/public` - gulp complies and writes all assets into here

`/routes` - expressJS route files

`/stylesheets` - SASS

`/util` - utils for the server-side

`/views` - views for the server side, using Jade templates

This is running on heroku, through travis CI