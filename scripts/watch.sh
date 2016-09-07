#!/bin/sh

mkdir -p build/development
mkdir build/development/js
cp -R src/index.html build/development/
cp -R src/static/css build/development/
cp -R src/static/fonts build/development/


node_modules/.bin/browserify \
	--require react \
	--require react-dom \
	--require classnames > build/development/js/react-libs.js

node_modules/.bin/watchify src/index.js \
	--outfile build/development/js/index.js \
	--external react \
	--external react-dom \
	--external classnames \
	--standalone WwPersonSearchVerify \
	--transform [ babelify ] \
	--transform [ envify --SERVER="${SERVER}" ]
	--verbose
