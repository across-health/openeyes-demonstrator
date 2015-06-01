#!/bin/bash

apt-get update

# Install git
apt-get install -y git

# Install io.js
curl -sL https://deb.nodesource.com/setup_iojs_1.x | sudo bash -
apt-get install -y iojs

# Install io.js global packages
npm install -g npm
npm install -g gulp
npm install -g bower
npm install -g nodemon

# Download and build sassc and libsass
apt-get install -y g++
(cd /usr/local/lib/ && git clone https://github.com/sass/sassc.git --branch 3.2.1 --depth 1)
(cd /usr/local/lib/ && git clone https://github.com/sass/libsass.git --branch 3.2.1 --depth 1)
export SASS_LIBSASS_PATH="/usr/local/lib/libsass"
(cd /usr/local/lib/sassc/ && make)
(cd /usr/local/bin/ && ln -s ../lib/sassc/bin/sassc sassc)

# There are issues have the node_modules in the shared /vagrant folder under windows
# as the file paths can get longer than windows allows (260 characters). Therefore we
# create a directory outside of the share and create a symlink to it.
mkdir /node_modules
chown vagrant:vagrant /node_modules
(cd /vagrant && ln -s /node_modules/ node_modules)

# Install project dependencies
(cd /vagrant && npm install --ignore-scripts)
(cd /vagrant && bower install --config.interactive=false --allow-root)
(cd /vagrant && npm rebuild node-sass)

# Initialize submodules
(cd /vagrant && git submodule update --init --recursive)
