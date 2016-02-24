#!/usr/bin/env node

var watch = require('node-watch');
var path = require('path');
var hamlc = require('haml-coffee');
var assert = require('util').assert;
var fs = require('fs');

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
        haml = fs.readFileSync(hamlFilepath, 'utf-8');
        console.log(`compiling ${asRelative(hamlFilepath)} to ${asRelative(htmlFilepath)}`);
        html = hamlc.render(haml);
        fs.writeFileSync(htmlFilepath, html);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log(`deleting ${asRelative(htmlFilepath)}`);
            try {
                fs.unlinkSync(htmlFilepath);
            } catch (err) {
                if (err.code === "ENOENT") {
                    console.log(`file ${asRelative(htmlFilepath)} was already deleted.`);
                } else {
                    throw(err);
                }
            }
        } else {
            throw(err);
        }
    }
}

function asRelative (filepath) {
    return path.relative('.', filepath);
}
