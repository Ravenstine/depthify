#!/usr/bin/env node
'use strict';

const gulp        = require('gulp')
const depthify    = require('../index')
const empty       = require('gulp-empty')
const parsePath   = require('parse-filepath')
let gm;
let args          = require('minimist')(process.argv.slice(2))

if(args.h || args.help){
  let fs       = require('fs')
  let helpText = fs.readFileSync("./helpfile.txt", "utf8")
  console.log(helpText)
  return;
}

let threshold     = (args.t || args.threshold)
let resize        = (args.r || args.resize);
let invert        = (args.i || args.invert);

if(threshold || resize || invert){
  gm = require('gulp-gm')
} else {
  gm = empty
}

let input       = parsePath(args['_'][0]) 
let destination = parsePath(args['_'].slice(-1).pop()) 

gulp.src(`${input.path}/*`)
  .pipe(
    gm((gmfile) => {
      if(threshold){gmfile.threshold(threshold)}
      if(resize){gmfile.resize(resize, resize)}
      if(invert){gmfile.negative()}
      return gmfile
    })
  )
  .pipe(depthify(destination.base, {
    alpha: true,
    zUp: false,
    bitDepth: 16
  }))
  .pipe(gulp.dest(destination.dir || './'))