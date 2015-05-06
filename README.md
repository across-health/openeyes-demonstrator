# OpenEyes Demonstrator

[![Build Status](https://travis-ci.org/davet1985/openeyes-demonstrator.svg?branch=master)](https://travis-ci.org/davet1985/openeyes-demonstrator)

This is a front-end demonstrator using the following technologies: -

* [io.js](https://iojs.org/en/index.html)
* [expressJS](http://expressjs.com/)
* [Jade templating engine](http://jade-lang.com/)
* [Foundation](http://foundation.zurb.com/)
* [SASS](http://sass-lang.com/)
* [AngularJS](https://angularjs.org/)
* [Gulp](http://gulpjs.com/)
* [TravisCI](https://travis-ci.org/)
* [Heroku](https://www.heroku.com/)

This demonstrator is built and deployed by Travis CI to Heroku, the resulting deploy can be found at [http://across-openeyes-demonstrator.herokuapp.com/patients](http://across-openeyes-demonstrator.herokuapp.com/patients)

## Development

To run locally for development ensure you have the following installed.

* node.js, or more specifically, we are using iojs v1.8.1

For mac I would recommend installing Node Version Manager (nvm) through homebrew.

```sh
brew install nvm
nvm install iojs
nvm use iojs
```

Node comes with a version of NPM but to make sure it's up-to-date run `npm install -g npm`

Then a couple of node modules need to be installed globally, to do this run: -

```sh
npm install -g gulp
npm install -g bower
```

From here you should be able to run `npm start` and it will download all the necessary node modules, bower components and gulp will do it's thing and the server should be running on http://localhost:3000.

For development you might want to install nodemon and run using `nodemon bin/www`

This will watch for file changes and automatically restart the server for you.

Also to watch and compile assets you should also have a terminal open running `gulp watch`

## Install submodules

To ensure the submodules are installed, run: -

```git submodule init```

## Folder structure

`/data` - sample JSON data that could come from a back-end service

`/eyedraw` - git submodule

`/patient_app` - angularJS app for patient screen

`/public` - gulp complies and writes all assets into here

`/routes` - expressJS route files

`/stylesheets` - SASS

`/util` - utils for the server-side

`/views` - views for the server side, using Jade templates
