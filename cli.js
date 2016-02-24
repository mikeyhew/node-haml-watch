#!/usr/bin/env node

var gaze = require('gaze');
var path = require('path');
var hamlc = require('haml-coffee');
var assert = require('util').assert;
var fs = require('fs');

if (process.argv.length === 2) {
    console.log("Usage: haml-watch watch-dir [watch-dir...]");
    process.exit(1);
}

var watchDirs = process.argv.slice(2).map(f => path.resolve(f))

var gazers = watchDirs.map(function (dir) {
    return gaze('*.haml', {cwd: dir});
});

gazers.forEach(function (gazer) {
    gazer.on('all', onAll);
});


function onAll (event, hamlFilepath) {
    htmlFilepath = hamlFilepath.slice(0, hamlFilepath.length - '.haml'.length) + '.html';
    switch (event) {
        case 'added':
        case 'changed':
            console.log(`compiling ${asRelative(hamlFilepath)} to ${asRelative(htmlFilepath)}`);
            haml = fs.readFileSync(hamlFilepath, 'utf-8');
            html = hamlc.render(haml);
            fs.writeFileSync(htmlFilepath, html);
            break;
        case 'deleted':
            console.log(`deleting ${asRelative(htmlFilepath)}`);
            fs.unlinkSync(htmlFilepath);
            break;
    }
}

function asRelative (filepath) {
    return path.relative('.', filepath);
}
