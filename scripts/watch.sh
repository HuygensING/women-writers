#!/bin/sh

node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	--watch \
	src/index.jade &

./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/react.css \
	--watch \
	src/stylus/index.styl &

node_modules/.bin/watchify src/index.jsx \
	--detect-globals false \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--outfile build/development/js/react-src.js \
	--standalone WomenWritersEdit \
	--transform [ babelify --plugins object-assign ] \
	--verbose