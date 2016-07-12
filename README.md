Depthify
--------
Extract 3D data from a series of images.

Inspired by [GotMesh](https://github.com/gcb5083/gotmesh), which was made for the purpose of getting 3-dimensional data using milk.

Depthify expects one or more images where high-luminance represents depth and low-luminance represents lack thereof.  Ideally, you will probably want to thresholdhold and/or negativize your images so that the pixels in every alpha shape is counted equally(since that's the only part of the image layers that matters).  Also, if your images don't represent slices, don't expect anything useful as a result. :)

## Installation
`npm install -g depthify`

## Use
Example: 

`depthify input/images output.png`

That example takes images from the `input` directory and compiles them into an 8-bit PNG formatted depth map in the current directory.  Both PNG and JPG are supported.

### Flags
- **alpha** : `-a` or `--alpha` will omit faces that have no depth.  Does nothing if outputting an OBJ. (default)
- **bit depth**: `-d` or `--depth` sets the color depth when creating a PNG.  Can be either 8 or 16. (default: 8)
- **z up**: `-z` or `--z-up` sets the *Z* dimension as the "up" direction.  Does nothing when creating an image.

**The following flags require GraphicsMagick to be installed.**    
- **threshold**: `-t` or `--threshold` will threshold the input images with a given precent value.  (example: `-t 80%`)
- **invert**: `-i` or `--invert` will invert the input images.
- **resize**: `-r` or `--resize` will resize the input images based on a given percent value.  (example: `-r 10%`)

### Transform Stream API
You can also use Depthify as a transform stream library.  This is very convenient if you want to create a pipeline, with a library like Gulp, to pre-process your images.  For example, you can easily write a script that does contour/feature detection, color keying, blending, etc., and hands off the result to Depthify.

The following uses GraphicsMagick to threshold & scale down the images, and then pipes those images into Depthify.

```
'use strict';

const gulp        = require('gulp')
const depthify    = require('depthify')
const gm          = require('gulp-gm')

gulp.src('input/*')
  .pipe(gm((gmfile) => {
    return gmfile
      .threshold('45%')
      .negative()
      .resize('10%', '10%')
  }))
  .pipe(depthify('depthmap.png', {
    bitDepth: 16
  }))
  .pipe(gulp.dest('./output'))

``` 

#### Options

- **alpha** : If the output is to be an OBJ file, omit faces that have no depth. (default: `false`)
- **bitDepth**: When creating a depth map image, set the bitDepth.  Can be either 8 or 16. (default: 8)
- **zUp**: Sets the *Z* dimension as the "up" direction.  Does nothing when creating an image. (default: false)

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.