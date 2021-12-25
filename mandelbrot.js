'use strict'


document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

let colourHue = 0;

//global
const imageWidth = 2

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
    console.log(typeof parseNumber(canvas.getAttribute('height')))


    let ctx = canvas.getContext('2d')
    let pixelImage
    let column
    let row
    // console.log(pixelImage.data.length)
    
    for (row = 0; row < parseNumber(canvas.getAttribute('height')); row+=imageWidth) {
        //color a full row
        for (column = 0; column < parseNumber(canvas.getAttribute('width')); column+=imageWidth) {
            //color the single pixel (or the square if each unit > 1 pixel)
            colourSquare()
            ctx.putImageData(pixelImage,column,row)
        }
    }
    
    
    
    
    

    function colourSquare() {
        pixelImage = ctx.createImageData(imageWidth, imageWidth)
        for (let i = 0; i < pixelImage.data.length; i += 4) {
            pixelImage.data[i] = column //r
            pixelImage.data[i + 1] = 0 //g
            pixelImage.data[i + 2] = row //b
            pixelImage.data[i + 3] = 255
        }
    }
}


function parseNumber(string) {
    return Number(string.replace('px', ''))
}