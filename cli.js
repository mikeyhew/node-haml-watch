#!/usr/bin/env node

var watch = require('node-watch');
var path = require('path');
var assert = require('util').assert;
var fs = require('fs');
var exec = require('child_process').exec;
var parseArgs = require('minimist');
var format = require('string-format');

argv = parseArgs(process.argv.slice(2), {
    string: ['input-extension', 'output-extension', 'command'],
    default: {
        'input-extension': '.haml',
        'output-extension': '.html',
        'command': 'bundle exec haml {infile} >{outfile}'
    },
});

function usage() {
    console.log("Usage: haml-watch watch-dir [watch-dir...]");
    process.exit(1);
}

if (argv._.length < 1) {
    usage();
}

var watchDirs = argv._.map(f => path.resolve(f))

watch(watchDirs, onChange);

function onChange(filepath) {
    if (!filepath.match(new RegExp(argv['input-extension'] + '$'))) {
        return;
    }
    var hamlFilepath = filepath;
    var htmlFilepath = hamlFilepath.slice(0, hamlFilepath.length - argv['input-extension'].length) + argv['output-extension'];
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
    var command = format(argv.command, {
        infile: hamlFilepath,
        outfile: htmlFilepath,
    });
    console.log(command);
    exec(command)
    .on('error', console.error);
}

function asRelative(filepath) {
    return path.relative('.', filepath);
}
