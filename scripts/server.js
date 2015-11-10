#!/usr/bin/env node

var browserSync = require("browser-sync").create();
var modRewrite = require("connect-modrewrite");
var debounce = require("lodash.debounce");
var proxy = require("proxy-middleware");
var url = require('url');

var baseDir = "./build/development";
var watchFiles = [
	baseDir + "/js/*.js",
	baseDir + "/css/*.css",
	baseDir + "/index.html"
];

function onFilesChanged(event, file) {
	if (event === "change") {
		browserSync.reload(file);
	}
}

browserSync.watch(watchFiles, debounce(onFilesChanged, 300));

//var proxyOptions = url.parse("https://acc.repository.huygens.knaw.nl");
var proxyOptions = url.parse("https://test.repository.huygens.knaw.nl");
proxyOptions.route = "/repository/api";

browserSync.init({
	server: {
		baseDir: baseDir,
		middleware: [
			proxy(proxyOptions),
			modRewrite([
				"^/womenwriters/vre/css/(.*)$ /css/$1 [L]",
				"^/womenwriters/vre/js/(.*).js$ /js/$1.js [L]",
				"^/womenwriters/vre/images/(.*)$ /images/$1 [L]",
				"^/womenwriters/vre/fonts/(.*)$ /fonts/$1 [L]",
				"^/womenwriters/vre/?.*$ /index.html [L]"
			])
		]
	}
});
