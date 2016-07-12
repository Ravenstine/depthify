'use strict';

// We need both of these because one has a sync API and
// the other has 16-bit write support.  Ugh.
// Fortunately, png-coder is an earlier fork of pngjs,
// so we can use pngjs to create buffer of a png-coder file.
const PNG      = require('pngjs').PNG
const pngcoder = require('png-coder').PNG

class DepthMap extends Uint8ClampedArray {
  // Image is strictly grayscale, so it only stores luma values
  // rather than RGB.
  constructor(values, width, height){
    super(values)
    this.width  = width
    this.height = height
    this.len    = this.length / 4 // the pixel count
    this.layers = 0
  }
  toBuffer(options){
    let bitDepth   = options.bitDepth || 8
    let maxVal     = {8: 255, 16: 65535}[bitDepth]
    let png, i;
    png            = new pngcoder({width: this.width, height: this.height, depthInBytes: bitDepth, color: false})
    let setValue   = {8: 'writeUInt8', 16: 'writeUInt16BE'}[bitDepth]
    i = 0;
    while(i < this.length){
      let value = Math.floor(this[i] * (maxVal / this.layers))
      png.data[setValue](value, (i*4))
      png.data[setValue](value, (i*4)+1)
      png.data[setValue](value, (i*4)+2)
      png.data[setValue](maxVal, (i*4)+3)
      i++
    }
    return PNG.sync.write(png)        
  }
}

module.exports = DepthMap