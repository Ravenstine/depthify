'use strict';

class Vertex {
  constructor(x, y, z, i, mesh){
    this.x = x
    this.y = y
    this.z = z
    this.mesh = mesh;
  }
  isAlpha(){
    return parseFloat(this.y) > 0
  }
  toObjString(options){
    options = options || {}
    if(options.zUp){
      return `v ${this.x} ${this.y} ${this.z}`
    } else {
      return `v ${this.x} ${this.z} ${this.y}`
    }
  }
}

class Face {
  constructor(v1, v2, v3, v4, mesh){
    this.v1   = v1
    this.v2   = v2
    this.v3   = v3
    this.v4   = v4
    this.mesh = mesh 
  }
  isAlpha(){
    let mesh    = this.mesh
    return (mesh[this.v1 - 1] || mesh[this.v2 - 1] || mesh[this.v3 - 1] || mesh[this.v4 - 1]) ? true : false
  }
  toObjString(){
    return `f ${this.v4} ${this.v3} ${this.v2} ${this.v1}`
  }
}

class Mesh extends Float32Array {
  constructor(values, width, height, name){
    super(values)
    this.width  = width
    this.height = height
    this.name   = name
  }
  toObj(options){
    options = options || {};
    let len    = this.length
    let x, y, z, v1, v2, v3, v4, face, vertex;
    let vertices = [`# Meshify OBJ Output`, `o ${this.name}`]
    let faces    = ['s off']
    // Generate vertices
    for(let i=0; i<len; i++){
      z     = (this[i]).toFixed(6)
      x     = (i % this.width).toFixed(6)
      y     = Math.floor(i / this.width).toFixed(6)
      vertex = new Vertex(x, y, z)
      vertices.push(vertex.toObjString(options))
    }
    // Generate faces
    for(let i=0; i<len; i++){
      v1    = i + 1
      if(v1 % this.width){
        v2    = v1 + 1
        v3 = v2 + this.width
        if(v3 <= len){
          v4 = v3 - 1
          face = new Face(v1, v2, v3, v4, this)
          if((options.alpha && face.isAlpha()) || !options.alpha){
            faces.push(face.toObjString())
          }
        }
      }
    }
    return vertices.concat(faces).join('\n')
  }
  toBuffer(options){
    return new Buffer(this.toObj(options))
  }
}

module.exports = Mesh