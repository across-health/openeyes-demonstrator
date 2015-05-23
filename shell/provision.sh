#!/bin/bash

apt-get update

# Install git
apt-get install -y git

# Install io.js
curl -sL https://deb.nodesource.com/setup_iojs_1.x | sudo bash -
apt-get install -y iojs

# Install io.js global packages
npm install -g gulp
npm install -g bower

# Download and build sassc and libsass
apt-get install -y g++
(cd /usr/local/lib/ && git clone https://github.com/sass/sassc.git --branch 3.2.1 --depth 1)
(cd /usr/local/lib/ && git clone https://github.com/sass/libsass.git --branch 3.2.1 --depth 1)
(cd /usr/local/lib/sassc/ && SASS_LIBSASS_PATH="/usr/local/lib/libsass"; make)
(cd /usr/local/bin/ && ln -s ../lib/sassc/bin/sassc sassc)

# Install project dependencies
(cd /vagrant && npm install --ignore-scripts)
(cd /vagrant && bower install --config.interactive=false)

# Initialize submodules
(cd /vagrant && git submodule update --init --recursive)
