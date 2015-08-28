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
	--detect-globals false \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--standalone WomenWritersEdit \
	--transform [ babelify --plugins object-assign ] \
	--verbose > build/development/js/react-src.js

# # Build Backbone JS
# node_modules/.bin/browserify src/coffee/main.coffee \
# 	--detect-globals false \
# 	--extension=.coffee \
# 	--extension=.jade \
# 	--external jquery \
# 	--external backbone \
# 	--external underscore \
# 	--external d3 \
# 	--standalone WomenWriters \
# 	--transform [ coffeeify ] \
# 	--transform [ jadeify ] \
# 	--verbose > build/development/js/backbone-src.js