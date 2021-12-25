'use strict'


document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

let colourHue = 0;


// the width of a unit square.
const imageWidth = 10
let coordinateOffsetX
let coordinateOffsetI


class Coordinate {

    constructor(x, i) {
        this.x = x
        this.i = i
    }

    square() {

    }

    toString() {
        return `${this.x} + ${this.i}i`
    }
}
function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrort')
    canvas.setAttribute('height', '500px')
    canvas.setAttribute('width', '500px')
    coordinateOffsetX = parseNumber(canvas.getAttribute('width'))/2
    coordinateOffsetI = parseNumber(canvas.getAttribute('height'))/2

    document.querySelector('body').appendChild(canvas)
    
    let test = new Coordinate(5,5)
    console.log(test.toString())

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

    
    //colour all the rows in a loop
    for (row = 0; row < parseNumber(canvas.getAttribute('height')); row+=imageWidth) {
        colourRow()
    }
    
    
    
    
    //colour a full row
    function colourRow() {
        for (column = 0; column < parseNumber(canvas.getAttribute('width')); column += imageWidth) {
            //color the single pixel (or the square if each unit > 1 pixel)
            colourSquare()
            ctx.putImageData(pixelImage, column, row)
        }
    }

    //colour a single square or pixel
    function colourSquare() {
        pixelImage = ctx.createImageData(imageWidth, imageWidth)
        // console.log(`Graph X pos: ${convertToXCoordinate(row)}`)
        // console.log(`Graph I pos: ${convertToICoordinate(column)}`)
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

/**
 * Converts to x coordinate in mandelbrot set
 * @param {number} xCanvasPos 
 * @returns {number}
 */
function convertToXCoordinate(xCanvasPos) {
    let converted = (xCanvasPos - coordinateOffsetX) / 100
    return converted
}

/**
 * Converts to i coordinate in mandelbrot set
 * @param {number} yCanvasPos 
 * @returns {number}
 */
function convertToICoordinate(yCanvasPos) {
    let converted = (yCanvasPos - coordinateOffsetI) / 100
    return converted
}


/*
Notes:

i*i = -1
i*i*i = -i
i*i*i*i = 1




*/