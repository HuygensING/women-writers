#!/bin/sh

node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	src/{index, edit}.jade

./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/backbone.css \
	src/stylus/main.styl

node_modules/.bin/browserify src-edit/index.js \
	--detect-globals false \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--standalone WomenWritersEdit \
	--transform [ babelify --plugins object-assign ] \
	--verbose > build/development/js/react-src.js

node_modules/.bin/browserify src/coffee/main.coffee \
	--detect-globals false \
	--extension=.coffee \
	--extension=.jade \
	--external jquery \
	--external backbone \
	--external underscore \
	--external d3 \
	--standalone WomenWriters \
	--transform [ coffeeify ] \
	--transform [ jadeify ] \
	--verbose > build/development/js/backbone-src.js