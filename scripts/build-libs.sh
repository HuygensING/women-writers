#!/bin/sh

# Create dirs
rm -rf build/development
mkdir -p build/development/js
mkdir build/development/css

# Copy static content
cp -r static/* build/development

# Copy Faceted Search CSS
cp node_modules/hibb-faceted-search/dist/main.min.css build/development/css/hibb-faceted-search.css

# Copy Modal CSS
cp node_modules/hibb-modal/dist/main.css build/development/css/hibb-modal.css

# Bundle React libs
node_modules/.bin/browserify \
	--require classnames \
	--require immutable \
	--require react > build/development/js/react-libs.js

# Bundle Backbone libs
node_modules/.bin/browserify \
	--require jquery \
	--require backbone \
	--require underscore \
	--require d3 > build/development/js/backbone-libs.js