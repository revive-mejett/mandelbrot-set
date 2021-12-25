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

    //returns the squared value of the i coordinate
    //returns a real result
    squareI() {
        let squaredCoeff = this.i*this.i
        //because i is also squared, which turns into -1. 
        //the returned value is now a real number, positive or nevgative as a result.
        return -squaredCoeff
    }

    //returns the squared value of the x coordinate
    squareX() {
        return this.x*this.x
    }

    //multiplies the x and i values together, multiplied by 2. this is the result for multiplying inners and outers for FOIL.
    innerOuter() {
        return this.x*this.i*2
    }

    squareCoordinate() {
        let squaredCoeff = this.squareX()
        let innerOuter = this.innerOuter()
        let squaredIs = this.squareI()
        return new Coordinate(squaredCoeff + squaredIs, innerOuter)
        return 'Merry Christmas!!!!!'
    }

    addCoordinate(otherCoord) {
        return new Coordinate(this.x + otherCoord.x, this.i + otherCoord.i)
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
    
    //test code!
    let test = new Coordinate(-1, 0)
    console.log(`number of iterations: ${determineIterations(test)}`)


    console.log('phoenix loves jett')


    drawFullImage()
    

}

//determine how many steps it takes for a coordinate to blow up, otherwise 20 for coords in the mandelbrort set
function determineIterations(coordinate) {
    let numberIterations = mandelbrortEquation(new Coordinate(0,0), coordinate, 1);
    console.log(numberIterations)
    return numberIterations
}

//calculate a new coordinate based on the formula of the mandelbrot set.
function mandelbrortEquation(coordinate, constant, iteration) {
    //Z = (z)^2 + C
    let result

    //if the coordinate numbers expand into infinity, return the iteration and its said to be not in the mandelbrort set
    //if this function has been called 20 times, return 20 as it is inside the mandelbrot set.
    if (coordinate.x > 100 || coordinate.i > 100 || iteration >= 20) {
        return iteration
    }

    result = coordinate.squareCoordinate().addCoordinate(constant)
    console.log(result.toString());
    return mandelbrortEquation(result, constant, iteration + 1) //call again recursively

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