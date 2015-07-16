#!/bin/sh

node_modules/.bin/browserify \
	--require classnames \
	--require immutable \
	--require react > build/development/libs.js