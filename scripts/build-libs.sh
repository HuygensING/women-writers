#!/bin/sh

rm -rf build/development
mkdir -p build/development/js
mkdir build/development/css

cp -r static/* build/development

cp node_modules/hibb-faceted-search/dist/main.min.css build/development/css/faceted-search.css

node_modules/.bin/browserify \
	--require classnames \
	--require immutable \
	--require react > build/development/js/react-libs.js

node_modules/.bin/browserify \
	--require jquery \
	--require backbone \
	--require underscore \
	--require d3 > build/development/js/backbone-libs.js