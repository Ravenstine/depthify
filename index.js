'use strict';

const through     = require('through2');
const gutil       = require('gulp-util');
const PluginError = gutil.PluginError;
const File        = gutil.File;
const DepthMap    = require('./lib/depth-map')
const Mesh        = require('./lib/mesh')
const getPixels   = require("get-pixels")
const PNG         = require('pngjs')

module.exports = function(fileName, opt) {
  opt = opt || {};

  let output;

  function bufferContents(file, enc, cb) {
    getPixels(file._contents, `image/${file.path.split('.').pop()}`, (err, pixels) => {
      if(err) {
        return console.log("Bad image path")
      }
      let dimensions    = pixels.shape.slice()
      let width         = dimensions[0]
      let height        = dimensions[1]
      let values        = pixels.data
      let valuesLength  = values.length
      if(!output){
        let objectName  = fileName.split('.')[0]
        let outputClass;
        if(fileName.split('.').pop().includes("png")){
          outputClass = DepthMap
        } else {
          outputClass = Mesh
        }
        output = new outputClass(valuesLength / 4, width, height)
      }
      for(let i=0; i<valuesLength; i+=4){
        let r = values[i]
        let g = values[i+1]
        let b = values[i+2]
        let v = Math.max(Math.max(r, g), b)
        let z = (v > 127) ? 1 : 0
        output[i / 4] += z
      }
      output.layers += 1
      cb()
    })    
  }

  function endStream(cb) {
    if (!output) {
      cb();
      return;
    }
    let file      = new File()
    file.path     = fileName
    let buff      = output.toBuffer(opt)
    file.contents = buff
    this.push(file)
    cb()
  }
  return through.obj(bufferContents, endStream);
};