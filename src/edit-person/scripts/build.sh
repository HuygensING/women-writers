#!/bin/sh

node_modules/.bin/browserify src/index.jsx \
	--detect-globals false \
	--extension=.jsx \
	--external classnames \
	--external immutable \
	--external react \
	--standalone WomenWritersEditPerson \
	--transform [ babelify --plugins object-assign ] \
	--verbose > build/development/index.js