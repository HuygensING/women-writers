#!/bin/sh

mkdir -p build/development
sed 's/{GIT_HASH}/'$GIT_COMMIT'/g' src/index.html > build/development/index.html
cp -R src/static/css build/development/
cp -R src/static/fonts build/development/
cp -R src/static/js build/development/


node_modules/.bin/browserify \
	--require react \
	--require classnames \
	--require react-dom > build/development/js/react-libs.js

node_modules/.bin/browserify src/index.js \
	--external react \
	--external react-dom \
	--standalone WwPersonSearchVerify \
	--transform [ babelify ] \
	--transform [ envify --SERVER="${SERVER}" --NODE_ENV="production" ] > build/development/js/index.js