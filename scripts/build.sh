#!/bin/sh

mkdir -p build/development
mkdir build/development/js
cp -R src/index.html build/development/
cp -R src/static/css build/development/
cp -R src/static/fonts build/development/

node_modules/.bin/browserify \
	--require react \
	--require classnames \
	--require react-dom > build/development/js/react-libs.js

node_modules/.bin/browserify src/index.js \
	--external react \
	--external react-dom \
	--standalone WwPersonSearchVerify \
	--transform [ babelify ] \
	--transform [ envify --SERVER="${SERVER}" ] > build/development/js/index.js