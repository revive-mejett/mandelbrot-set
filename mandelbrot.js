'use strict'


document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

let colourHue = 0;

//global
const imageWidth = 10

function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrort')
    canvas.setAttribute('height', '500px')
    canvas.setAttribute('width', '500px')
    document.querySelector('body').appendChild(canvas)
    
  
    // document.addEventListener('mousemove', drawFromCursor)
    // document.addEventListener('mousedown', toggleClick)

    drawFullImage()


}

function drawFullImage() {
    const canvas = document.querySelector('.mandelbrort')
    console.log(canvas.getAttribute('width'))
    console.log(canvas.getAttribute('height'))

    let ctx = canvas.getContext('2d')
    let pixelImage = ctx.createImageData(imageWidth, imageWidth)
    console.log(pixelImage.data.length)
    
    //color all the pixels
    for (let i = 0; i < pixelImage.data.length; i +=4) {

        pixelImage.data[i] = 255; //r
        pixelImage.data[i+1] = 0; //g
        pixelImage.data[i+2] = 0; //b
        pixelImage.data[i+3] = 255; //a
    }
    
    // let pixelImage = 
    ctx.putImageData(pixelImage,imageWidth,imageWidth)

}