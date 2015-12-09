#!/bin/sh

# Create dirs
rm -rf build/development
mkdir -p build/development/js
mkdir build/development/css

# Copy static content
cp -r static/* build/development

# Bundle React libs
node_modules/.bin/browserify \
	--require classnames \
	--require immutable \
	--require react > build/development/js/react-libs.js

