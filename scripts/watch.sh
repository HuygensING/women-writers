#!/bin/sh

node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	--watch \
	src/index.jade src-edit/edit.jade &

./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/backbone.css \
	--watch \
	src/stylus/main.styl &

./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/react.css \
	--watch \
	src-edit/stylus/index.styl &

# node_modules/.bin/browserify src/index.jsx \
# 	--detect-globals false \
# 	--extension=.jsx \
# 	--external classnames \
# 	--external immutable \
# 	--external react \
# 	--standalone WomenWritersEditPerson \
# 	--transform [ babelify --plugins object-assign ] \
# 	--verbose | derequire > build/development/index.js
#


# node_modules/.bin/watchify src/index.js \
# 	--detect-globals false \
# 	--extension=.jsx \
# 	--external classnames \
# 	--external immutable \
# 	--external react \
# 	--outfile 'derequire > build/development/index.js' \
# 	--standalone WomenWritersEditPerson \
# 	--transform [ babelify --plugins object-assign ] \
# 	--verbose

node_modules/.bin/watchify src-edit/index.jsx \
	--detect-globals false \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--outfile build/development/js/react-src.js \
	--standalone WomenWritersEdit \
	--transform [ babelify --plugins object-assign ] \
	--verbose &

node_modules/.bin/watchify src/coffee/main.coffee \
	--detect-globals false \
	--extension=.coffee \
	--extension=.jade \
	--external jquery \
	--external backbone \
	--external underscore \
	--external d3 \
	--outfile build/development/js/backbone-src.js \
	--standalone WomenWriters \
	--transform [ coffeeify ] \
	--transform [ jadeify ] \
	--verbose