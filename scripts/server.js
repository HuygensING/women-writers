#!/usr/bin/env node

var browserSync = require("browser-sync").create();
var modRewrite = require("connect-modrewrite");
var debounce = require("lodash.debounce");

var baseDir = "./build/development";
var watchFiles = [
	baseDir + "/js/*.js",
	baseDir + "/css/*.css",
	baseDir + "/index.html"
];

var onFilesChanged = function(event, file) {
	if (event === "change") {
		browserSync.reload(file);
	}
};

browserSync.watch(watchFiles, debounce(onFilesChanged, 300));

browserSync.init({
	server: {
		baseDir: baseDir,
		middleware: modRewrite([
			// "^/womenwriters$ /index.html",
			"^/womenwriters/css/(.*)$ /css/$1 [L]",
			"^/womenwriters/js/(.*).js$ /js/$1.js [L]",
			"^/womenwriters/images/(.*)$ /images/$1 [L]",
			"^/womenwriters/fonts/(.*)$ /fonts/$1 [L]",
			"^/womenwriters/(persons|documents)/.+$ /edit.html [L]",
			"^/womenwriters/?.*$ /index.html [L]"
		])
	}
});
