'use strict'
import Coordinate from './src/Coordinate.js'

// the width of a unit square.
const imageWidth = 1
const maxIterations = 2000
const canvasWidth = 400
const canvasHeight = 400
const cycleMultiplier = 4 //determines the increment of new cycles of colours

document.addEventListener('DOMContentLoaded', setup)



let coordinateOffsetX
let coordinateOffsetI

//will be the controls
let zoom = canvasWidth/4
let magnification = 1
let panX = 0
let panI = 0
let panXmultiplier = 1
let panImultiplier = 1

function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrot')
    canvas.setAttribute('height', `${canvasHeight}px`)
    canvas.setAttribute('width', `${canvasWidth}px`)
    coordinateOffsetX = canvasWidth/2
    coordinateOffsetI = canvasHeight/2

    document.querySelector('#canvas-section').appendChild(canvas)
    console.log('phoenix loves jett')

    //input sliders
    document.querySelector('#pan-x').addEventListener('change', updatePanMultiplierValues)
    document.querySelector('#pan-i').addEventListener('change', updatePanMultiplierValues)

    //zoom value
    document.querySelector('#re-render').addEventListener('click', reRender)
    
 
    document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                panX += panXmultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowLeft') {
                panX -= panXmultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowUp') {
                panI -= panImultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowDown') {
                panI += panImultiplier / magnification
                reRenderKey()
            }
        })
    drawFullImage()
    console.log(determineColour(450))
    

}

function reRenderKey() {

    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 0);

}

function reRender(e) {
    e.preventDefault()
    const canvas = document.querySelector('.mandelbrot')
    let zoomInputValue = document.querySelector('#zoom').value

    let ctx = canvas.getContext('2d')
    //update panx/pan i values
    //update the global variable to be used for rerendering
    magnification *= zoomInputValue
    zoom *= zoomInputValue

    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 0);

}

function updatePanMultiplierValues() {
    
    const panXmultiplierInput = document.querySelector('#pan-x').value
    const panImultiplierInput = document.querySelector('#pan-i').value
    document.querySelector('#pan-x-display').textContent = panXmultiplierInput
    document.querySelector('#pan-i-display').textContent = panImultiplierInput
    panXmultiplier = panXmultiplierInput
    panImultiplier = panImultiplierInput

}


//determine how many steps it takes for a coordinate to blow up, otherwise 20 for coords in the mandelbrot set
function determineIterations(coordinate) {
    let numberIterations = mandelbrotEquation(new Coordinate(0,0), coordinate, 1);
    return numberIterations
}

//calculate a new coordinate based on the formula of the mandelbrot set.
function mandelbrotEquation(coordinate, constant, iteration) {
    //Z = (z)^2 + C
    let result

    //if the coordinate numbers expand into infinity, return the iteration and its said to be not in the mandelbrot set
    //if this function has been called 20 times, return 20 as it is inside the mandelbrot set.
    if (coordinate.magnitude() > 2 || iteration >= maxIterations) {
        return iteration
    }

    result = coordinate.squareCoordinate().addCoordinate(constant)
    return mandelbrotEquation(result, constant, iteration + 1) //call again recursively

}

//burning ship fractal
function burningShipEquation(coordinate, constant, iteration) {
    //z = (|z|)^2 + C
    let result

    if (coordinate.magnitude() > 2 || iteration >= maxIterations) {
        return iteration
    }

    result = coordinate.squareAbsCoordinate().addCoordinate(constant)
    return burningShipEquation(result, constant, iteration + 1) //call again recursively

}

function drawFullImage() {
    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')
    let pixelImage
    let column
    let row
    
    //colour all the rows in a loop
    for (row = 0; row < canvasHeight; row+=imageWidth) {
        colourRow()
    }
    
    //colour a full row.
    function colourRow() {
        for (column = 0; column < canvasWidth; column += imageWidth) {
            //color the single pixel (or the square if each unit > 1 pixel)
            colourSquare()
            ctx.putImageData(pixelImage, column, row)
        }
    }

    //colour a single square or pixel
    function colourSquare() {
        pixelImage = ctx.createImageData(imageWidth, imageWidth)
        // get a coordinate based on the position of this square
        let currentCoordinate = new Coordinate(convertToXCoordinate(column), convertToICoordinate(row))

        //determine the colour based on the number of iterations
        let colour = determineColour(determineIterations(currentCoordinate))

        for (let i = 0; i < pixelImage.data.length; i += 4) {
            pixelImage.data[i] = colour.red //r
            pixelImage.data[i + 1] = colour.green //g
            pixelImage.data[i + 2] = colour.blue //b
            pixelImage.data[i + 3] = 255 //aplha
        }
    }
}

/**Determines the colour to be plotted based on how many iterations to expand the coordinate (or black if in mandelbrot set)
 * 
 * @param {int} numberIterations -- The number of iterations taken
 * @returns {object} -- JSON object with rgb values
 */

let logged = false
function determineColour(numberIterations) {


    const navyToBlueBound = 30;
    const cyanBoundPercentage = 0.2;
    const greenBoundPercentage = 0.4;
    const yellowBoundPercentage = 0.6;
    const redBoundPercentage = 0.8;

    
    //for more than 30 iterations, colour them in a rainbow cycle that repeats until max iterations


    let prevCycleLowerBound
    let cycleLowerBound = 1
    let cycleRangeSize
    //rainbow cycle repeats after each 10^cycle iterations
    for (let upperCycleBound = 100; upperCycleBound <= maxIterations; upperCycleBound*=cycleMultiplier) {
        
        let bracketRangeSize
        cycleRangeSize = upperCycleBound-cycleLowerBound //300
        // console.log('cycle lower: ' +cycleLowerBound)
        // console.log('cycle upper b: ' +upperCycleBound)
        // console.log(cycleRangeSize)
        // console.log('#iterations: ' +numberIterations)
        // console.log('cyan iterations ' + (cyanBoundPercentage*cycleRangeSize + cycleLowerBound))
        // console.log('green iterations ' + (greenBoundPercentage*cycleRangeSize + cycleLowerBound))
        // console.log('yellow iterations ' + (yellowBoundPercentage*cycleRangeSize + cycleLowerBound))
        // console.log('red iterations ' + (redBoundPercentage*cycleRangeSize + cycleLowerBound))
        // console.log('blue iterations ' + (upperCycleBound))
    
        
        //blue to cyan 1-20
        if (numberIterations >= cycleLowerBound && numberIterations < cyanBoundPercentage*cycleRangeSize + cycleLowerBound) {
            bracketRangeSize = cyanBoundPercentage*cycleRangeSize //60
            

            return {
                red : 0,
                green : (numberIterations - cycleLowerBound)/bracketRangeSize * 255, // more green
                blue : 255
            }
        }

            //cyan to green 21-40
        else if (numberIterations >= cyanBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < greenBoundPercentage*cycleRangeSize + cycleLowerBound) {

            bracketRangeSize = greenBoundPercentage*cycleRangeSize - cyanBoundPercentage*cycleRangeSize
            return {
                red : 0,
                green : 255,
                blue : (bracketRangeSize - (numberIterations - cyanBoundPercentage*cycleRangeSize))/bracketRangeSize * 255 // less blue
            }
        }

        //green to yellow 41-60
        else if (numberIterations >= greenBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < yellowBoundPercentage*cycleRangeSize + cycleLowerBound) {


            bracketRangeSize = yellowBoundPercentage*cycleRangeSize - greenBoundPercentage*cycleRangeSize
            return {
                red : (numberIterations - greenBoundPercentage*cycleRangeSize)/bracketRangeSize * 255, // more red
                green : 255,
                blue : 0
            }
        }

            //yellow to red 61-80
        else if (numberIterations >= yellowBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < redBoundPercentage*cycleRangeSize + cycleLowerBound) {


            bracketRangeSize = redBoundPercentage*cycleRangeSize - yellowBoundPercentage*cycleRangeSize

            return {
                red : 255,
                green : (bracketRangeSize - (numberIterations - yellowBoundPercentage*cycleRangeSize))/bracketRangeSize * 255, //less green
                blue : 0
            }
        }

        //red to blue 81-100
        else if (numberIterations >= redBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations <= upperCycleBound) {


            bracketRangeSize = upperCycleBound - redBoundPercentage*cycleRangeSize

            return {
                red : (bracketRangeSize - (numberIterations - redBoundPercentage*cycleRangeSize))/bracketRangeSize * 255, //less red,
                green : 0,
                blue : (numberIterations - redBoundPercentage*cycleRangeSize)/bracketRangeSize * 255 //more blue
            }
        }

        else {
            cycleLowerBound = upperCycleBound //move to next cycle
        }
    }

    //return black if over max iterations
    return {
        red : 0,
        green : 0,
        blue : 0
    }

}
/**
 * Converts to x coordinate in mandelbrot set
 * @param {number} xCanvasPos 
 * @returns {number}
 */
function convertToXCoordinate(xCanvasPos) {
    let converted = ((xCanvasPos - coordinateOffsetX) / zoom) + panX
    return converted
}

/**
 * Converts to i coordinate in mandelbrot set
 * @param {number} yCanvasPos 
 * @returns {number}
 */
function convertToICoordinate(yCanvasPos) {
    let converted = ((yCanvasPos - coordinateOffsetI) / zoom) + panI
    return converted
}

