#!/bin/sh

# Build React HTML
node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	src/index.jade

# # Build Backbone CSS
# ./node_modules/.bin/stylus \
# 	--use nib \
# 	--compress \
# 	--out build/development/css/backbone.css \
# 	src/stylus/main.styl

# Build React CSS
./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/react.css \
	src/stylus/index.styl

# Build React JS
node_modules/.bin/browserify src/index.jsx \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--standalone WomenWritersEdit \
	--transform [ babelify --plugins object-assign ] \
	--verbose > build/development/js/react-src-v3.js
