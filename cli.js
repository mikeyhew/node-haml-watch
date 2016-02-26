#!/usr/bin/env node

var watch = require('node-watch');
var path = require('path');
var assert = require('util').assert;
var fs = require('fs');
var exec = require('child_process').exec;

if (process.argv.length === 2) {
    console.log("Usage: haml-watch watch-dir [watch-dir...]");
    process.exit(1);
}

var watchDirs = process.argv.slice(2).map(f => path.resolve(f))

watch(watchDirs, onChange);

function onChange(filepath) {
    if (path.extname(filepath) !== '.haml') {
        return;
    }
    var hamlFilepath = filepath;
    var htmlFilepath = hamlFilepath.slice(0, hamlFilepath.length - '.haml'.length) + '.html';
    try {
        fs.accessSync(hamlFilepath, fs.R_OK);
    } catch(err) {
        console.log(`deleting ${asRelative(htmlFilepath)}`);
        try {
            fs.unlinkSync(htmlFilepath);
        } catch (e) {
            console.log('error deleting file:', e);
        }
        return;
    }
    console.log(`compiling ${asRelative(hamlFilepath)} to ${asRelative(htmlFilepath)}`);
    exec(`bundle exec haml ${hamlFilepath} >${htmlFilepath}`)
    .on('error', console.error);
}

function asRelative(filepath) {
    return path.relative('.', filepath);
}
